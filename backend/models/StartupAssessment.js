const mongoose = require("mongoose");

const startupAssessmentSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      unique: true,
    },
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetAudience: {
      type: String,
    },
    problemStatement: {
      type: String,
    },
    currentSolution: {
      type: String,
    },
    differentiator: {
      type: String,
    },
    currentStage: {
      type: String,
    },
    revenueModel: {
      type: String,
    },
    marketLocation: {
      type: String,
    },
    founderBackground: {
      type: String,
    },
    industryExperience: {
      type: String,
    },
    competitors: {
      type: String,
    },
    customerInterviews: {
      type: String,
    },
    teamSize: {
      type: Number,
    },
    expectedPricing: {
      type: String,
    },
    customerAcquisition: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StartupAssessment", startupAssessmentSchema);
