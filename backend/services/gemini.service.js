const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Gemini AI Service
 * Implementation for AI Startup Advisor
 */

class GeminiService {
  constructor() {
    this.initGemini();
  }

  initGemini() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } else {
      console.warn("GEMINI_API_KEY is not set in environment variables.");
    }
  }

  /**
   * Evaluate a startup based on its assessment
   * @param {Object} assessmentData 
   * @returns {String} raw JSON string from AI
   */
  async generateEvaluation(assessmentData) {
    if (!this.model) this.initGemini();
    if (!this.model) throw new Error("Gemini AI is not initialized");

    const prompt = `
Evaluate the following startup based on this assessment data:
Target Audience: ${assessmentData.targetAudience || "N/A"}
Problem Statement: ${assessmentData.problemStatement || "N/A"}
Current Solution: ${assessmentData.currentSolution || "N/A"}
Differentiator: ${assessmentData.differentiator || "N/A"}
Current Stage: ${assessmentData.currentStage || "N/A"}
Revenue Model: ${assessmentData.revenueModel || "N/A"}
Market Location: ${assessmentData.marketLocation || "N/A"}
Founder Background: ${assessmentData.founderBackground || "N/A"}
Industry Experience: ${assessmentData.industryExperience || "N/A"}
Competitors: ${assessmentData.competitors || "N/A"}
Customer Interviews: ${assessmentData.customerInterviews || "N/A"}
Team Size: ${assessmentData.teamSize || "N/A"}
Expected Pricing: ${assessmentData.expectedPricing || "N/A"}
Customer Acquisition: ${assessmentData.customerAcquisition || "N/A"}

CRITICAL:
Return ONLY a raw JSON object.
Do not wrap in markdown.
Do not wrap in triple backticks.
Do not write the word json.
Do not add explanations.
Output must start with {
Output must end with }

Expected JSON format:
{
  "overallScore": number (0-100),
  "founderFitScore": number (0-100),
  "marketPotentialScore": number (0-100),
  "executionScore": number (0-100),
  "validationScore": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "risks": ["string"],
  "competitorThreats": ["string"],
  "marketOpportunities": ["string"],
  "mvpSuggestions": ["string"],
  "nextMilestones": ["string"],
  "fundingReadiness": "string",
  "investmentVerdict": "string",
  "recommendation": "string"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("GeminiService generateEvaluation Error:", error);
      throw new Error("Failed to generate AI evaluation.");
    }
  }

  /**
   * Answer founder's question using context
   * @param {Object} context 
   * @param {String} question 
   * @returns {String} textual answer from AI
   */
  async generateAdvice(context, question) {
    if (!this.model) this.initGemini();
    if (!this.model) throw new Error("Gemini AI is not initialized");

    const prompt = `
You are an expert AI Startup Advisor. Use the following context to answer the founder's question.

Startup Data:
Title: ${context.startup?.title || "Unknown"}
Description: ${context.startup?.description || "Unknown"}

Assessment Data:
${JSON.stringify(context.assessment || {})}

Current Evaluation:
${JSON.stringify(context.evaluation || {})}

Answer specifically using the startup context.
Do not give generic startup advice.
Reference actual startup data whenever possible.
Keep answer under 3 paragraphs.

Founder's Question: ${question}
`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("GeminiService generateAdvice Error:", error);
      throw new Error("Failed to generate AI advice.");
    }
  }
}

module.exports = new GeminiService();
