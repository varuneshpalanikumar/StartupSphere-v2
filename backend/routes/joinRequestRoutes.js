const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createJoinRequest,
  getStartupJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  voteJoinRequest,
  getProfessionalJoinRequests,
  getProfessionalRequestStatus
} = require("../controllers/joinRequestController");

router.post("/", authMiddleware, createJoinRequest);
router.get("/startup/:startupId", authMiddleware, getStartupJoinRequests);
router.get("/professional/:professionalId", authMiddleware, getProfessionalJoinRequests);
router.put("/accept/:requestId", authMiddleware, acceptJoinRequest);
router.put("/reject/:requestId", authMiddleware, rejectJoinRequest);
router.put("/vote/:requestId", authMiddleware, voteJoinRequest);
router.get("/status/:startupId/:professionalId", authMiddleware, getProfessionalRequestStatus);

module.exports = router;