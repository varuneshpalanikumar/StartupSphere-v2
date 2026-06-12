const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createInvestorRequest,
  investorShowInterest,
  getRequestsForInvestor,
  getRequestsForFounder,
  acceptInvestorRequest,
  rejectInvestorRequest
} = require("../controllers/investorRequestController");

router.post("/", authMiddleware, createInvestorRequest);
router.post("/interest", authMiddleware, investorShowInterest);

router.get("/investor/:investorId", authMiddleware, getRequestsForInvestor);
router.get("/founder/:founderId", authMiddleware, getRequestsForFounder);

router.put("/accept/:requestId", authMiddleware, acceptInvestorRequest);
router.put("/reject/:requestId", authMiddleware, rejectInvestorRequest);

module.exports = router;