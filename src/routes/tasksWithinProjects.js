import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { createTaskInProjectController, deleteTaskInProjectController, getAllTasksInProjectController, getTaskByIdInProjectController, updateTaskInProjectController } from '../controllers/tasksInProjectsController.js';
import { isProjectMember } from '../middlewares/isProjectMember.js';

const tasksInProjectsRouter = express.Router();

tasksInProjectsRouter.post("/task", authenticate, isProjectMember, createTaskInProjectController);
tasksInProjectsRouter.put("/task/:taskId", authenticate, updateTaskInProjectController);
tasksInProjectsRouter.get("/tasks/:projectId", authenticate, isProjectMember, getAllTasksInProjectController);
tasksInProjectsRouter.get(
  "/project/:projectId/task/:taskId",
  authenticate,
  isProjectMember,
  getTaskByIdInProjectController
);tasksInProjectsRouter.delete("/project/:projectId/task/:taskId", 
    authenticate, 
    isProjectMember, 
    deleteTaskInProjectController
);

export default tasksInProjectsRouter;