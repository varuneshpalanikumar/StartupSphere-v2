const Startup = require("../models/Startup");
const StartupAssessment = require("../models/StartupAssessment");
const StartupEvaluation = require("../models/StartupEvaluation");
const AppError = require("../utils/AppError");

// POST /api/assessments/:startupId
exports.createAssessment = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Founder must own startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to assess this startup", 403);
    }

    const existingAssessment = await StartupAssessment.findOne({ startup: startupId });
    if (existingAssessment) {
      throw new AppError("Assessment already exists for this startup", 400);
    }

    const assessment = new StartupAssessment({
      ...req.body,
      startup: startupId,
      founder: req.user.id,
    });

    await assessment.save();

    res.status(201).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/assessments/:startupId
exports.getAssessment = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Founder must own startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to view this assessment", 403);
    }

    const assessment = await StartupAssessment.findOne({ startup: startupId });
    if (!assessment) {
      throw new AppError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/assessments/:startupId
exports.updateAssessment = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Founder must own startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to update this assessment", 403);
    }

    const assessment = await StartupAssessment.findOneAndUpdate(
      { startup: startupId },
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!assessment) {
      throw new AppError("Assessment not found", 404);
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};
