const mongoose = require("mongoose");

const startupEvaluationSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      unique: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartupAssessment",
      required: true,
    },
    aiScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    founderFitScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    marketPotentialScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    executionScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    validationScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    risks: [
      {
        type: String,
      },
    ],
    competitorThreats: [
      {
        type: String,
      },
    ],
    marketOpportunities: [
      {
        type: String,
      },
    ],
    mvpSuggestions: [
      {
        type: String,
      },
    ],
    nextMilestones: [
      {
        type: String,
      },
    ],
    fundingReadiness: {
      type: String,
    },
    investmentVerdict: {
      type: String,
    },
    recommendation: {
      type: String,
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

startupEvaluationSchema.index({ aiScore: -1 });

module.exports = mongoose.model("StartupEvaluation", startupEvaluationSchema);
