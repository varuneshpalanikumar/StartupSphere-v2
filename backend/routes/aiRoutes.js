const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  evaluateStartup,
  chatWithAi,
  getEvaluation,
} = require("../controllers/aiController");

// AI routes require authentication
router.use(authMiddleware);

router.get("/evaluation/:startupId", getEvaluation);
router.post("/evaluate/:startupId", evaluateStartup);
router.post("/chat/:startupId", chatWithAi);

module.exports = router;
