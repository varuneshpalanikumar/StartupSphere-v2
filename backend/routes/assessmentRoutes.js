const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createAssessment,
  getAssessment,
  updateAssessment,
} = require("../controllers/assessmentController");

// Assessment routes require authentication
router.use(authMiddleware);

router.post("/:startupId", createAssessment);
router.get("/:startupId", getAssessment);
router.put("/:startupId", updateAssessment);

module.exports = router;
