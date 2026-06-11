const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const startupRoutes = require("./routes/startupRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const userRoutes = require("./routes/userRoutes");
const mentorRequestRoutes = require("./routes/mentorRequestRoutes");
const investorRequestRoutes = require("./routes/investorRequestRoutes");



const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentor-requests", mentorRequestRoutes);
app.use("/api/investor-requests", investorRequestRoutes);

app.get("/", (req, res) => {
  res.send("StartupSphere API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});