const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role, skills, portfolio, bio } = req.body;

    if (!name || name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters", 400, "VALIDATION_ERROR");
    }

    if (!email || !validateEmail(email)) {
      throw new AppError("Invalid email format", 400, "VALIDATION_ERROR");
    }

    if (!password || password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400, "VALIDATION_ERROR");
    }

    if (!role || !["founder", "professional", "mentor", "investor"].includes(role)) {
      throw new AppError("Invalid role", 400, "VALIDATION_ERROR");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError("Email already exists", 409, "DUPLICATE_EMAIL");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      skills: skills || [],
      portfolio: portfolio || "",
      bio: bio || ""
    });

    await user.save();
    res.status(201).json({ success: true, message: "Account created successfully" });

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
      throw new AppError("Invalid email format", 400, "VALIDATION_ERROR");
    }

    if (!password) {
      throw new AppError("Password is required", 400, "VALIDATION_ERROR");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;

    res.json({ success: true, message: "Login successful", token, user: userObj });

  } catch (error) {
    next(error);
  }
};