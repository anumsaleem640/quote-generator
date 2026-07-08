"use strict";

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Warn when connection drops (e.g. Atlas maintenance, network issue)
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    // Log reconnection
    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    // Fatal connection error after initial connect
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB error: ${err.message}`);
    });
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    // Exit the entire Node.js process — no point running the server without a DB
    process.exit(1);
  }
};

// module.exports = connectDB;
export default connectDB;
