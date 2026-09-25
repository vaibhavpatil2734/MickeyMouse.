const mongoose = require("mongoose");
const dns = require("dns");

// Force IPv4 first (helps with MongoDB Atlas DNS/network issues)
dns.setDefaultResultOrder("ipv4first");

// Use public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

module.exports = async function connectDB() {
  console.log("Connecting to MongoDB...");

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected Successfully");

    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};