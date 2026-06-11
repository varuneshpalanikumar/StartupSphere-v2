const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/startupsphere";
    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;