const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { addReview, getStartupReviews } = require("../controllers/reviewController");

router.post("/add", authMiddleware, addReview);

router.get("/startup/:startupId", getStartupReviews);

module.exports = router;