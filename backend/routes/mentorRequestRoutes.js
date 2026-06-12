const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createMentorRequest,
  getRequestsForMentor,
  getRequestsForFounder,
  acceptMentorRequest,
  rejectMentorRequest
} = require("../controllers/mentorRequestController");

router.post("/", authMiddleware, createMentorRequest);

router.get("/mentor/:mentorId", authMiddleware, getRequestsForMentor);
router.get("/founder/:founderId", authMiddleware, getRequestsForFounder);

router.put("/accept/:requestId", authMiddleware, acceptMentorRequest);
router.put("/reject/:requestId", authMiddleware, rejectMentorRequest);

module.exports = router;