const mongoose = require("mongoose");

const ConnectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB successfully connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

module.exports = ConnectDatabase;
