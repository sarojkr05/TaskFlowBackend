import { registerUser, loginUser } from "../services/userService.js";
import serverConfig from "../config/serverConfig.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await registerUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("register error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
};


export const logoutUserController = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
