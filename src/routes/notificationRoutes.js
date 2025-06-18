import express from "express";
import { getUserNotifications, markAllNotificationsAsRead } from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, getUserNotifications);
notificationRouter.patch("/read-all", authenticate, markAllNotificationsAsRead);

export default notificationRouter;
