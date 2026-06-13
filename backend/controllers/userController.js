const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.searchUsers = async (req, res, next) => {
  try {
    const { role, verified, skill, name } = req.query;

    let filter = {};

    if (role) {
      filter.role = role;
    }

    if (verified !== undefined) {
      filter.verified = verified === "true";
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(filter).select("-password");

    res.json({ success: true, data: users });

  } catch (error) {
    next(error);
  }
};

exports.getJoinedProjects = async (req, res, next) => {

  try {

    const user = await User.findById(req.params.userId)
      .populate("joinedProjects");

    if (!user) {
      throw new AppError("User not found", 404, "NOT_FOUND");
    }

    res.json({ success: true, data: user.joinedProjects });

  } catch (error) {
    next(error);
  }

};