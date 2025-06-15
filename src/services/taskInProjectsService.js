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

export async function createTaskInProjectService(
  userId,
  title,
  description,
  projectId,
  assignedTo
) {
  const project = await Project.findById(projectId);
  console.log("User ID:", userId);
  console.log("Project Members:", project.members);
  console.log("Project Data:", project);
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.members.some((m) => m.toString() === userId.toString())) {
    console.log("✅ User is a member!");
  } else {
    console.log("❌ User not found in members!");
  }
  return await createTaskInProject({
    title,
    description,
    projectId,
    assignedTo: assignedTo || null,
    createdBy: userId,
  });
}

// updating the task in the project

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
    const tasks = (await getAlltasksInProject(projectId))
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
  };

  // Check if task exists before deleting
  const existingTask = await getTaskInProjectById(taskId);
  if (!existingTask) {
    throw new NotFoundError("Task not found!")
  }

  return await deleteTaskInProjectById(taskId);
  } catch (error) {
    console.error("Error in deleting task in project ", error.message);

    if(error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    } else {
      throw new InternalServerError();
    }
  }
}