import mongoose from "mongoose";
import serverConfig from "./serverConfig.js"; // ✅ Add .js extension

async function connectDB() {
  try {
    await mongoose.connect(serverConfig.DB_URL);
    console.log("Successfully connected to MongoDB...");
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
  }
}

export default connectDB;
