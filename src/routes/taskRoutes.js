import express from "express";
import { createTaskController, deleteTaskController, getAllTasks, getTaskById, updateTaskController } from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const taskRouter = express.Router();

// Route for creating a task (protected)
taskRouter.post("/createtask", authenticate, createTaskController);
taskRouter.get("/", authenticate, getAllTasks);
taskRouter.get("/:id", authenticate, getTaskById);
taskRouter.put("/:id", authenticate, updateTaskController);
taskRouter.delete("/:id", authenticate, deleteTaskController);

export default taskRouter;
