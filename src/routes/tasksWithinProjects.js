import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createTaskInProjectController,
  deleteTaskInProjectController,
  getAllTasksInProjectController,
  getTaskByIdInProjectController,
  updateTaskInProjectController,
} from "../controllers/tasksInProjectsController.js";
import { isProjectMember } from "../middlewares/isProjectMember.js";
import { isProjectAdmin } from "../middlewares/isProjectAdmin.js";

const tasksInProjectsRouter = express.Router();

tasksInProjectsRouter.post(
  "/:projectId/tasks",
  authenticate,
  isProjectMember,
  createTaskInProjectController
);
tasksInProjectsRouter.put(
  "/:projectId/tasks/:taskId",
  authenticate,
  isProjectAdmin,
  updateTaskInProjectController
);
tasksInProjectsRouter.get(
  "/:projectId/tasks",
  authenticate,
  isProjectMember,
  getAllTasksInProjectController
);
tasksInProjectsRouter.get(
  "/project/:projectId/task/:taskId",
  authenticate,
  isProjectMember,
  getTaskByIdInProjectController
);

tasksInProjectsRouter.delete(
  "/:projectId/tasks/:taskId",
  authenticate,
  isProjectAdmin,
  deleteTaskInProjectController
);

export default tasksInProjectsRouter;
