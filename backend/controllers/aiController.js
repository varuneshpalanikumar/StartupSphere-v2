const Startup = require("../models/Startup");
const StartupAssessment = require("../models/StartupAssessment");
const StartupEvaluation = require("../models/StartupEvaluation");
const geminiService = require("../services/gemini.service");
const AppError = require("../utils/AppError");

// GET /api/ai/evaluation/:startupId
exports.getEvaluation = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Verify authenticated user owns startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to view evaluation for this startup", 403);
    }

    const evaluation = await StartupEvaluation.findOne({ startup: startupId });

    if (!evaluation) {
      return res.status(404).json({ success: false, message: "Evaluation not found" });
    }

    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/evaluate/:startupId
exports.evaluateStartup = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Verify authenticated user owns startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to evaluate this startup", 403);
    }

    const assessment = await StartupAssessment.findOne({ startup: startupId });
    if (!assessment) {
      throw new AppError("Startup assessment is missing", 400);
    }

    const aiResponseRaw = await geminiService.generateEvaluation(assessment);
    
    let parsedResponse;
    try {
      const cleaned = aiResponseRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedResponse = JSON.parse(cleaned);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response"
      });
    }

    // Calculate final aiScore
    const aiScore = 
      (parsedResponse.overallScore * 0.4) +
      (parsedResponse.founderFitScore * 0.2) +
      (parsedResponse.marketPotentialScore * 0.2) +
      (parsedResponse.executionScore * 0.1) +
      (parsedResponse.validationScore * 0.1);

    const evaluationData = {
      startup: startupId,
      assessment: assessment._id,
      aiScore: aiScore,
      founderFitScore: parsedResponse.founderFitScore,
      marketPotentialScore: parsedResponse.marketPotentialScore,
      executionScore: parsedResponse.executionScore,
      validationScore: parsedResponse.validationScore,
      strengths: parsedResponse.strengths || [],
      weaknesses: parsedResponse.weaknesses || [],
      risks: parsedResponse.risks || [],
      competitorThreats: parsedResponse.competitorThreats || [],
      marketOpportunities: parsedResponse.marketOpportunities || [],
      mvpSuggestions: parsedResponse.mvpSuggestions || [],
      nextMilestones: parsedResponse.nextMilestones || [],
      fundingReadiness: parsedResponse.fundingReadiness || "Pending",
      investmentVerdict: parsedResponse.investmentVerdict || "Pending",
      recommendation: parsedResponse.recommendation || "Pending",
      calculatedAt: Date.now()
    };

    const evaluation = await StartupEvaluation.findOneAndUpdate(
      { startup: startupId },
      evaluationData,
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    // Save the AI score directly to the Startup model so global lists/leaderboards can read it
    await Startup.findByIdAndUpdate(startupId, { $set: { aiScore: Math.round(aiScore) } }, { strict: false });

    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/chat/:startupId
exports.chatWithAi = async (req, res, next) => {
  try {
    const { startupId } = req.params;
    const { question } = req.body;

    if (!question) {
      throw new AppError("Question is required", 400);
    }

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404);
    }

    // Verify authenticated user owns startup
    if (startup.founder.toString() !== req.user.id) {
      throw new AppError("Not authorized to access AI chat for this startup", 403);
    }

    const assessment = await StartupAssessment.findOne({ startup: startupId });
    const evaluation = await StartupEvaluation.findOne({ startup: startupId });

    const context = {
      startup,
      assessment,
      evaluation
    };

    const answer = await geminiService.generateAdvice(context, question);

    res.status(200).json({
      success: true,
      data: {
        answer
      }
    });
  } catch (error) {
    next(error);
  }
};
