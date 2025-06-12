import { createTask, deleteTaskService, taskService, updateTaskService } from "../services/taskService.js";
// import * as taskService from "../services/taskService.js";

async function createTaskController(req, res) {
  try {
    const userId = req.user.id; // Get logged-in user ID from authentication middleware
    const task = await createTask(req.body, userId);

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.user.id);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.user.id; // Extracted from authentication middleware
    const userRole = req.user.role;
    const updatedData = req.body;

    const updatedTask = await updateTaskService(taskId, userId, updatedData, userRole);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id; // Extracted from authentication middleware
    const userRole = req.user.role;

    const deletedTask = await deleteTaskService(taskId, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
};

export { createTaskController };
