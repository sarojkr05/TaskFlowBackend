import { registerUser, loginUser } from "../services/userService.js";

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

    // ✅ Set the JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Send only on HTTPS in production
      sameSite: "Strict", // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};