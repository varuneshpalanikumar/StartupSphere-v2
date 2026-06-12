const Startup = require("../models/Startup");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createStartup = async (req, res, next) => {
  try {
    const { title, description, founder, fundingRequired, techSupportRequired, mentorshipRequired, mentorReviewRequested } = req.body;

    if (!title || title.trim().length < 3) {
      throw new AppError("Title must be at least 3 characters", 400, "VALIDATION_ERROR");
    }

    if (!description || description.trim().length < 10) {
      throw new AppError("Description must be at least 10 characters", 400, "VALIDATION_ERROR");
    }

    if (!founder || !isValidObjectId(founder)) {
      throw new AppError("Invalid founder ID", 400, "VALIDATION_ERROR");
    }

    const startup = new Startup({
      title,
      description,
      founder,
      fundingRequired: fundingRequired || 0,
      techSupportRequired: techSupportRequired || false,
      mentorshipRequired: mentorshipRequired || false,
      mentorReviewRequested: mentorReviewRequested || false
    });

    await startup.save();
    res.status(201).json({ success: true, message: "Startup created successfully", startup });

  } catch (error) {
    next(error);
  }
};

exports.getAllStartups = async (req, res, next) => {
  try {
    const startups = await Startup.find().populate("founder", "name email");
    res.status(200).json({ success: true, data: startups });
  } catch (error) {
    next(error);
  }
};

exports.calculateStartupScore = async (req, res, next) => {
  try {
    const { startupId } = req.params;

    if (!isValidObjectId(startupId)) {
      throw new AppError("Invalid startup ID", 400, "VALIDATION_ERROR");
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const reviews = await Review.find({ startup: startupId });
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    const progressScore = Math.min(startup.progress / 2, 40);
    const reviewScore = Math.min((averageRating / 5) * 30, 30);
    const teamScore = Math.min(startup.professionalsJoined.length * 5, 20);
    const investorScore = Math.min(startup.investorsInterested.length * 2, 10);
    const finalScore = Math.round(progressScore + reviewScore + teamScore + investorScore);

    startup.startupScore = finalScore;
    await startup.save();

    res.json({ success: true, message: "Score calculated", finalScore });

  } catch (error) {
    next(error);
  }
};

exports.updateStartupProgress = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const { progress, latestUpdate } = req.body;

    if (!isValidObjectId(startupId)) {
      throw new AppError("Invalid startup ID", 400, "VALIDATION_ERROR");
    }

    if (progress === undefined || progress === null) {
      throw new AppError("Progress is required", 400, "VALIDATION_ERROR");
    }

    if (isNaN(progress) || progress < 0 || progress > 100) {
      throw new AppError("Progress must be between 0 and 100", 400, "VALIDATION_ERROR");
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    startup.progress = progress;
    if (latestUpdate) startup.latestUpdate = latestUpdate;
    await startup.save();

    res.json({ success: true, message: "Progress updated successfully" });

  } catch (error) {
    next(error);
  }
};

exports.addInvestorInterest = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const { investorId } = req.body;

    if (!isValidObjectId(startupId)) {
      throw new AppError("Invalid startup ID", 400, "VALIDATION_ERROR");
    }

    if (!investorId || !isValidObjectId(investorId)) {
      throw new AppError("Invalid investor ID", 400, "VALIDATION_ERROR");
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const investor = await User.findById(investorId);
    if (!investor || investor.role !== "investor") {
      throw new AppError("User is not an investor", 400, "INVALID_USER_ROLE");
    }

    const alreadyInterested = startup.investorsInterested.some(id => id.toString() === investorId.toString());
    if (!alreadyInterested) {
      startup.investorsInterested.push(investorId);
      await startup.save();
    }

    res.json({ success: true, message: "Interest added successfully" });

  } catch (error) {
    next(error);
  }
};

exports.getStartupDetails = async (req, res, next) => {
  try {
    const { startupId } = req.params;

    if (!isValidObjectId(startupId)) {
      throw new AppError("Invalid startup ID", 400, "VALIDATION_ERROR");
    }

    const startup = await Startup.findById(startupId)
      .populate("founder", "name email role portfolio verified")
      .populate("professionalsJoined", "name email role skills portfolio verified")
      .populate("mentorsJoined", "name email role skills portfolio verified")
      .populate("investorsInterested", "name email role portfolio verified");

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const reviews = await Review.find({ startup: startupId }).populate("mentor", "name email");
    res.json({ success: true, startup, reviews });

  } catch (error) {
    next(error);
  }
};

exports.searchStartups = async (req, res, next) => {
  try {
    const { techSupportRequired, mentorshipRequired, mentorReviewRequested, minScore, minProgress, title } = req.query;
    let filter = {};

    if (techSupportRequired !== undefined) {
      filter.techSupportRequired = techSupportRequired === "true";
    }
    if (mentorshipRequired !== undefined) {
      filter.mentorshipRequired = mentorshipRequired === "true";
    }
    if (mentorReviewRequested !== undefined) {
      filter.mentorReviewRequested = mentorReviewRequested === "true";
    }
    if (minScore !== undefined) {
      if (isNaN(minScore)) {
        throw new AppError("Min score must be a number", 400, "VALIDATION_ERROR");
      }
      filter.startupScore = { $gte: Number(minScore) };
    }
    if (minProgress !== undefined) {
      if (isNaN(minProgress)) {
        throw new AppError("Min progress must be a number", 400, "VALIDATION_ERROR");
      }
      filter.progress = { $gte: Number(minProgress) };
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const startups = await Startup.find(filter).populate("founder", "name email");
    res.json({ success: true, data: startups });

  } catch (error) {
    next(error);
  }
};

exports.getFounderStartups = async (req, res, next) => {
  try {
    const { founderId } = req.params;

    if (!isValidObjectId(founderId)) {
      throw new AppError("Invalid founder ID", 400, "VALIDATION_ERROR");
    }

    const startups = await Startup.find({ founder: founderId }).populate("founder", "name email");
    res.json({ success: true, data: startups });

  } catch (error) {
    next(error);
  }
};

exports.getMentorStartups = async (req, res, next) => {
  try {
    const { mentorId } = req.params;

    if (!isValidObjectId(mentorId)) {
      throw new AppError("Invalid mentor ID", 400, "VALIDATION_ERROR");
    }

    const startups = await Startup.find({ mentorsJoined: mentorId })
      .populate("founder", "name email")
      .populate("mentorsJoined", "name email role");

    res.json({ success: true, data: startups });
  } catch (error) {
    next(error);
  }
};

exports.getInvestorStartups = async (req, res, next) => {
  try {
    const { investorId } = req.params;

    if (!isValidObjectId(investorId)) {
      throw new AppError("Invalid investor ID", 400, "VALIDATION_ERROR");
    }

    const startups = await Startup.find({ investorsInterested: investorId })
      .populate("founder", "name email")
      .populate("investorsInterested", "name email role");

    res.json({ success: true, data: startups });

  } catch (error) {
    next(error);
  }
};
