const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createStartup,
  getAllStartups,
  calculateStartupScore,
  updateStartupProgress,
  addInvestorInterest,
  getStartupDetails,
  searchStartups,
  getFounderStartups,
  getMentorStartups,
  getInvestorStartups
} = require("../controllers/startupController");

router.post("/create", authMiddleware, createStartup);

router.get("/all", getAllStartups);

router.get("/score/:startupId", calculateStartupScore);

router.put("/progress/:startupId", authMiddleware, updateStartupProgress);

router.put("/invest/:startupId", authMiddleware, addInvestorInterest);

router.get("/details/:startupId", getStartupDetails);

router.get("/search", searchStartups);

router.get("/founder/:founderId", authMiddleware, getFounderStartups);

router.get("/mentor/:mentorId", authMiddleware, getMentorStartups);

router.get("/investor/:investorId", authMiddleware, getInvestorStartups);

module.exports = router;