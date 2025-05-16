import User from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Register User
async function registerUser(userDetails) {
  try {
    console.log("Received user details:", userDetails);

    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      throw { reason: "User already exists", statusCode: 400 };
    }

    const newUser = new User({
      name: userDetails.name,
      email: userDetails.email,
      password: userDetails.password,
      role: userDetails.role || "user" // default role is user
    });

    await newUser.save();
    console.log("User Registered Successfully:", newUser);

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { user: newUser, token };
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    throw error;
  }
}

// Login User
async function loginUser({ email, password }) {
  try {

    const user = await User.findOne({ email });

    if (!user) {
      throw { reason: "Invalid credentials", statusCode: 401 };
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw { reason: "Invalid credentials", statusCode: 401 };
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { user, token };
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    throw error;
  }
}

export { registerUser, loginUser };
