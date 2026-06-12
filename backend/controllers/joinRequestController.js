const JoinRequest = require("../models/JoinRequest");
const Startup = require("../models/Startup");
const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.createJoinRequest = async (req, res, next) => {
  try {
    const { startupId, professionalId, message } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const existingRequest = await JoinRequest.findOne({
      startup: startupId,
      professional: professionalId
    });

    if (existingRequest) {
      throw new AppError("You already sent a join request for this startup", 400, "DUPLICATE_REQUEST");
    }

    const newRequest = new JoinRequest({
      startup: startupId,
      professional: professionalId,
      message
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      request: newRequest
    });

  } catch (error) {
    next(error);
  }
};

exports.getStartupJoinRequests = async (req, res, next) => {
  try {
    const requests = await JoinRequest.find({
      startup: req.params.startupId,
      status: "pending"
    }).populate("professional", "name email verified");

    res.json({ success: true, data: requests });

  } catch (error) {
    next(error);
  }
};

exports.acceptJoinRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Request not found", 404, "NOT_FOUND");
    }

    if (request.status === "accepted") {
      return res.json({
        success: true,
        message: "Request already accepted"
      });
    }

    request.status = "accepted";
    await request.save();

    await Startup.findByIdAndUpdate(
      request.startup,
      {
        $addToSet: { professionalsJoined: request.professional }
      }
    );

    await User.findByIdAndUpdate(
      request.professional,
      {
        $addToSet: { joinedProjects: request.startup }
      }
    );

    res.json({
      success: true,
      message: "Professional successfully added to startup team"
    });

  } catch (error) {
    next(error);
  }
};

exports.rejectJoinRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Request not found", 404, "NOT_FOUND");
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Request rejected"
    });

  } catch (error) {
    next(error);
  }
};

exports.voteJoinRequest = async (req, res, next) => {
  try {
    const { voterId, voteType } = req.body;

    const voter = await User.findById(voterId);

    if (!voter) {
      throw new AppError("Voter not found", 404, "NOT_FOUND");
    }

    if (voter.role !== "professional") {
      throw new AppError("Only professionals can vote", 403, "FORBIDDEN");
    }

    if (voter.verified !== true) {
      throw new AppError("Only verified professionals can vote", 403, "FORBIDDEN");
    }

    const request = await JoinRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Join request not found", 404, "NOT_FOUND");
    }

    if (request.status !== "pending") {
      throw new AppError("Voting allowed only for pending requests", 400, "INVALID_STATE");
    }

    if (voteType !== "up" && voteType !== "down") {
      throw new AppError("voteType must be 'up' or 'down'", 400, "VALIDATION_ERROR");
    }

    if (!request.votes) {
      request.votes = [];
    }

    const existingVote = request.votes.find(
      (vote) => vote.voter.toString() === voterId
    );

    if (existingVote && existingVote.voteType === voteType) {
      return res.json({
        success: true,
        message: "Vote already recorded",
        upVotes: request.upVotes,
        downVotes: request.downVotes
      });
    }

    if (!existingVote) {
      request.votes.push({
        voter: voterId,
        voteType: voteType
      });
    } else {
      existingVote.voteType = voteType;
    }

    request.upVotes = request.votes.filter(
      (vote) => vote.voteType === "up"
    ).length;

    request.downVotes = request.votes.filter(
      (vote) => vote.voteType === "down"
    ).length;

    await request.save();

    res.json({
      success: true,
      message: "Vote recorded successfully",
      upVotes: request.upVotes,
      downVotes: request.downVotes
    });

  } catch (error) {
    next(error);
  }
};

exports.getProfessionalJoinRequests = async (req, res, next) => {
  try {
    const requests = await JoinRequest.find({
      professional: req.params.professionalId
    })
      .populate("startup", "title description progress startupScore")
      .populate("professional", "name email");

    res.json({ success: true, data: requests });

  } catch (error) {
    next(error);
  }
};

exports.getProfessionalRequestStatus = async (req, res, next) => {
  try {

    const { startupId, professionalId } = req.params;

    const request = await JoinRequest.findOne({
      startup: startupId,
      professional: professionalId
    });

    if (!request) {
      return res.json({ success: true, status: "none" });
    }

    res.json({ success: true, status: request.status });

  } catch (error) {
    next(error);
  }
};