import tasksInProjectSchema from "../schemas/tasksInProjectSchema.js";
import mongoose from 'mongoose';
import BadRequestError from "../utils/badRequestError.js";
import NotFoundError from "../utils/notFoundError.js";

export async function createTaskInProject(taskData) {
  return await tasksInProjectSchema.create(taskData);
}

export async function updateTaskInProject(taskId, taskData) {

  const updatedTask = await tasksInProjectSchema.findByIdAndUpdate(
    taskId,
    { $set: {...taskData} },
    { new: true, runValidators: true }
  );

  console.log("Updated task from repo: ", updatedTask);

  if (!updatedTask) {
    throw new BadRequestError(["Task not found or update failed"]);
  }

  return updatedTask;
}


export async function getAlltasksInProject() {
  try {
    return await tasksInProjectSchema.find();
  } catch (error) {
    console.error("Database Error - Fetching All Tasks:", error);
    throw new InternalServerError("Database error while retrieving tasks.");
  }
}

export async function getTaskInProjectById(taskId) {
  // Validate if taskId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError("Invalid Task ID");
  }

  // Fetch task from DB
  return await tasksInProjectSchema.findById(taskId);
}

// deleting the task 
export async function deleteTaskInProjectById(taskId) {
  try {

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new BadRequestError(["Invalid task id"])
  }

  const deleteTask = await tasksInProjectSchema.findByIdAndDelete(taskId);
  if(!deleteTask) {
    throw new NotFoundError("Task not found or already deleted")
  }
  return deleteTask;
  } catch (error) {
    console.error("Error in deleteTaskInProjectById:", error.message);

    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error; // Re-throw known errors
    } else {
      throw new InternalServerError(); // Handle unexpected errors
    }
  }
}
