const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, skills, portfolio, bio } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
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

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Signup error",
      error: error.message
    });
  }
};


exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.password) delete userObj.password;

    res.json({
      token,
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};