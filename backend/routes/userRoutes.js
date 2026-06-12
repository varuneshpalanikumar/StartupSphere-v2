const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { searchUsers, getJoinedProjects } = require("../controllers/userController");

router.get("/search", searchUsers);

router.get("/:userId/joined-projects", authMiddleware, getJoinedProjects);

module.exports = router;