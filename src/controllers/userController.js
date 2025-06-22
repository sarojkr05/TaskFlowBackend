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
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
};

// export const loginUserController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await loginUser({ email, password });

//     const parseExpiration = (exp) => {
//       if (exp.endsWith("m")) return parseInt(exp) * 60 * 1000;
//       if (exp.endsWith("h")) return parseInt(exp) * 60 * 60 * 1000;
//       if (exp.endsWith("d")) return parseInt(exp) * 24 * 60 * 60 * 1000;
//       return 60 * 60 * 1000; // default 1h
//     };
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Send only on HTTPS in production
//       sameSite: "Strict", // Protect against CSRF
//       // maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//       maxAge: parseExpiration(serverConfig.JWT_EXPIRES_IN|| "1h"), // Use the expiration from env or default to 1 hour
//     });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user,
//       token,
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.reason || "Internal Server Error",
//     });
//   }
// };

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
