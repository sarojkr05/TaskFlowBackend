import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import {  addUserToProjectController, createProjectController, getProjectByIdController, removeUserFromProjectController } from '../controllers/projectController.js';
import { isProjectAdmin } from '../middlewares/isProjectAdmin.js';

const projectRouter = express.Router();

projectRouter.post('/createProject', authenticate, createProjectController); // Route for creating a project (protected)
projectRouter.get('/:id', authenticate, getProjectByIdController); // Route for fetching a project by ID (protected)
projectRouter.post("/:id/add-user", authenticate, isProjectAdmin, addUserToProjectController);
projectRouter.delete("/:id/remove-user/:userId", authenticate, isProjectAdmin, removeUserFromProjectController);

export default projectRouter;