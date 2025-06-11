import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {  addUserToProjectController, createProjectController, deleteProjectController, getAllProjectsController, getProjectByIdController, removeUserFromProjectController, updateProjectController } from '../controllers/projectController.js';
import { isProjectAdmin } from '../middlewares/isProjectAdmin.js';

const projectRouter = express.Router();

projectRouter.post('/create-project', authenticate, createProjectController); // Route for creating a project (protected)
projectRouter.get('/:id', authenticate, getProjectByIdController); // Route for fetching a project by ID (protected)
projectRouter.post("/:id/add-user", authenticate, isProjectAdmin, addUserToProjectController);
projectRouter.delete("/:id/remove-user/:userId", authenticate, isProjectAdmin, removeUserFromProjectController);
projectRouter.get('/', authenticate, getAllProjectsController)
projectRouter.put('/:id', authenticate, isProjectAdmin, updateProjectController)
projectRouter.delete('/:id', authenticate, isProjectAdmin, deleteProjectController)

export default projectRouter;