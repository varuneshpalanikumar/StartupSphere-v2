const Review = require("../models/Review");
const Startup = require("../models/Startup");
const AppError = require("../utils/AppError");

exports.addReview = async (req, res, next) => {
  try {
    const { startupId, mentorId, rating, comment } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    if (!startup.mentorReviewRequested) {
      throw new AppError("Mentor review not requested for this startup", 403, "FORBIDDEN");
    }

    const existingReview = await Review.findOne({
      startup: startupId,
      mentor: mentorId
    });

    if (existingReview) {
      throw new AppError("You have already submitted a review for this startup", 400, "DUPLICATE_REVIEW");
    }

    const review = new Review({
      startup: startupId,
      mentor: mentorId,
      rating,
      comment
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    next(error);
  }
};

exports.getStartupReviews = async (req, res, next) => {
  try {
    const { startupId } = req.params;

    const reviews = await Review.find({ startup: startupId })
      .populate("mentor", "name email");

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};