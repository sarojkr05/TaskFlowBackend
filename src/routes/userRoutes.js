import express from "express";
import { registerUserController, loginUserController, logoutUserController } from "../controllers/userController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout", logoutUserController);

userRouter.get("/profile", authenticate, (req, res) => {
    res.json({success: true, user: req.user});
})

//Admin Only route
userRouter.get("/admin/dashboard", authenticate, authorizeRoles("admin"), (req, res) => {
    res.json({ success: true, message: "Welcome, Admin!" });
  });

export default userRouter;
