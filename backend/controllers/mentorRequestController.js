const MentorRequest = require("../models/MentorRequest");
const User = require("../models/User");
const Startup = require("../models/Startup");
const AppError = require("../utils/AppError");

exports.createMentorRequest = async (req, res, next) => {
  try {
    const { startupId, founderId, mentorId, requestType, message } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const mentor = await User.findById(mentorId);

    if (!mentor || mentor.role !== "mentor") {
      throw new AppError("Mentor not found", 404, "NOT_FOUND");
    }

    const existingRequest = await MentorRequest.findOne({
      startup: startupId,
      mentor: mentorId,
      requestType: requestType
    });

    if (existingRequest) {
      throw new AppError("This request has already been sent to this mentor for this startup", 400, "DUPLICATE_REQUEST");
    }

    const newRequest = new MentorRequest({
      startup: startupId,
      founder: founderId,
      mentor: mentorId,
      requestType,
      message
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Mentor request created successfully",
      request: newRequest
    });

  } catch (error) {
    next(error);
  }
};

exports.getRequestsForMentor = async (req, res, next) => {
  try {
    const requests = await MentorRequest.find({
      mentor: req.params.mentorId,
      status: "pending"
    })
      .populate("startup", "title description startupScore progress")
      .populate("founder", "name email")
      .populate("mentor", "name email verified");

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.getRequestsForFounder = async (req, res, next) => {
  try {
    const requests = await MentorRequest.find({
      founder: req.params.founderId
    })
      .populate("startup", "title")
      .populate("mentor", "name email verified");

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.acceptMentorRequest = async (req, res, next) => {
  try {
    const request = await MentorRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Mentor request not found", 404, "NOT_FOUND");
    }

    request.status = "accepted";
    await request.save();

    if (request.requestType === "mentorship") {
      await Startup.findByIdAndUpdate(
        request.startup,
        { $addToSet: { mentorsJoined: request.mentor } }
      );
    }

    res.json({
      success: true,
      message: "Mentor request accepted",
      requestType: request.requestType,
      startupId: request.startup
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectMentorRequest = async (req, res, next) => {
  try {
    const request = await MentorRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Mentor request not found", 404, "NOT_FOUND");
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Mentor request rejected"
    });
  } catch (error) {
    next(error);
  }
};