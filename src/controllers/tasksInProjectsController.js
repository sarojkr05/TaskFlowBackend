import { getAlltasksInProject } from "../repository/taskInProjects.js";
import { createTaskInProjectService, deleteTaskInProjectService, getAllTasksInProjectService, getTaskByIdInProjectService, updateTaskInProjectService } from "../services/taskInProjectsService.js";
import BadRequestError from "../utils/badRequestError.js";
import NotFoundError from "../utils/notFoundError.js"
import InternalServerError from "../utils/internalSeverError.js"

export async function createTaskInProjectController(req, res) {
  try {
    const { title, description, assignedTo, status, priority } = req.body;
    const { projectId } = req.params;
    const userId = req.user._id;

    const task = await createTaskInProjectService(userId, title, description, projectId, assignedTo, status, priority || null);
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

export async function updateTaskInProjectController(req, res) {
  try {

    const { taskId, projectId } = req.params;
    const taskData = req.body;
    
    if (!taskId || !projectId || !taskData) {
      throw new BadRequestError(["Missing required fields: taskId, projectId or taskData"]);
    }

    const updatedTask = await updateTaskInProjectService(taskId, taskData);
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error in updateTaskInProjectController:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}


export async function getAllTasksInProjectController(req, res) {
  try {
    const { projectId } = req.params;
    const tasks = await getAllTasksInProjectService(projectId)
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching all tasks:", error);

    // If it's already a known AppError type, forward as is, else wrap it as InternalServerError
    const errResponse = error.statusCode
      ? error
      : new InternalServerError("Failed to fetch tasks");

    res.status(errResponse.statusCode).json({
      success: false,
      message: errResponse.message,
    });
  }
}

export async function getTaskByIdInProjectController(req, res) {
  try {
    const { taskId, projectId } = req.params;

    if(!taskId || !projectId) {
      throw new BadRequestError(["Taks Id is required and Project Id is required"]);
    }

    const task = await getTaskByIdInProjectService(taskId, projectId);

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error in getTaskByIdInProjectController:", error.message);

    if (error instanceof BadRequestError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function deleteTaskInProjectController(req, res) {
  try {

    const { taskId, projectId } = req.params;
    if (!taskId || !projectId) {
      throw new BadRequestError(["TaskId and ProjectId is required"]);
    }

    const deletedTask = await deleteTaskInProjectService(taskId, projectId);

    if(!deletedTask) {
      throw new NotFoundError("Task or project not found!")
    }

    res.status(200).json({
      success: true,
      message: "Successfully deleted the task from project",
      data: deletedTask,
    });
  } catch (error) {
    console.error("Error in Delete Task Controller:", error.message);
    res.status(400).json({
      success: false,
      message: new InternalServerError().message
    });
  }
}