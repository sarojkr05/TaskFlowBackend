import mongoose from "mongoose";
import {
  createTaskInProject,
  deleteTaskInProjectById,
  getAlltasksInProject,
  getTaskInProjectById,
  updateTaskInProject,
} from "../repository/taskInProjects.js";
import BadRequestError from "../utils/badRequestError.js";
import NotFoundError from "../utils/notFoundError.js";
import InternalServerError from "../utils/internalSeverError.js";
import Project from "../schemas/projectSchema.js";
import Notification from "../schemas/notificationSchema.js";
import { io, onlineUsers } from "../server.js";

export async function createTaskInProjectService(
  userId,
  title,
  description,
  projectId,
  assignedTo,
  status,
  priority
) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.members.some((m) => m.toString() === userId.toString())) {
    console.log("User not found in members!");
  } else {
    console.log("User is a member!");
  }

  const task = await createTaskInProject({
    title,
    description,
    status,
    priority,
    projectId,
    assignedTo: assignedTo || null,
    createdBy: userId,
  });

  if (assignedTo && assignedTo !== userId.toString()) {
    const message = `You were assigned a task: "${title}" in project "${project.name}"`;

    await Notification.create({
      user: assignedTo,
      message,
      project: projectId,
    });

    console.log("assignedTo:", assignedTo);
console.log("onlineUsers map:", onlineUsers);

    const socketId = onlineUsers.get(assignedTo.toString());
    if (socketId) {
      io.to(socketId).emit("projectAdded", {
        message: message,
        project: projectId,
      });
    }
  }
  return task;
}

export async function updateTaskInProjectService(taskId, taskData) {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(["Invalid Task ID"]);
  }

  if (!taskData || typeof taskData !== "object") {
    throw new BadRequestError(["Invalid Task Data"]);
  }

  const updatedTask = await updateTaskInProject(taskId, taskData);
  return updatedTask;
}

export async function getAllTasksInProjectService(projectId) {
  try {
    const tasks = await getAlltasksInProject(projectId);
    return tasks;
  } catch (error) {
    console.error("Error in Service Layer - Fetching Tasks:", error);
    throw new InternalServerError("Failed to retrieve tasks.");
  }
}

export async function getTaskByIdInProjectService(taskId) {
  // Validate if taskId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(["Invalid Task ID"]);
  }

  // Fetch task from repository
  const task = await getTaskInProjectById(taskId);

  // If task is not found, throw NotFoundError
  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
}
// delete task api in Project

export async function deleteTaskInProjectService(taskId) {
  try {
    // Validate if taskId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new BadRequestError("[Invalid task id]");
    }

    // Check if task exists before deleting
    const existingTask = await getTaskInProjectById(taskId);
    if (!existingTask) {
      throw new NotFoundError("Task not found!");
    }

    return await deleteTaskInProjectById(taskId);
  } catch (error) {
    console.error("Error in deleting task in project ", error.message);

    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    } else {
      throw new InternalServerError();
    }
  }
}
