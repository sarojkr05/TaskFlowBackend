import taskRepository from "../repository/taskRepository.js";
import { updateTask } from "../repository/taskRepository.js";
import Task from "../schemas/taskSchema.js";

async function createTask(taskDetails, userId) {
  try {
    const newTask = await Task.create({
      ...taskDetails,
      createdBy: userId,
    });

    return newTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}

const taskService = {
  getAllTasks: async (userId) => {
    try {
      const tasks = await taskRepository.getTasksByUserId(userId);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Error fetching tasks");
    }
  },

  getTaskById: async (taskId, userId, userRole) => {
    try {
      const task = await taskRepository.getTaskById(taskId);
      if (!task) throw new Error("Task not found");
      if (task.createdBy.toString() !== userId && userRole !== "admin") {
    throw new Error("Unauthorized access");
  }
      return task;
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      throw new Error("Error fetching task");
    }
  },
};

export const updateTaskService = async (taskId, userId, updatedData, userRole) => {
  try {
    // Find the task first
    const task = await updateTask(taskId, updatedData);
    console.log("task from service", task)

    if (!task) {
      throw { reason: "Task not found", statusCode: 404 };
    }

    // Allow update if the user is the task owner or an admin
    if (task.createdBy.toString() !== userId && userRole !== "admin") {
      throw { reason: "Unauthorized to update this task", statusCode: 403 };
    }

    return task;
  } catch (error) {
    throw error;
  }
};

export const deleteTaskService = async (taskId, userId, userRole) => {
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw { reason: "Task not found", statusCode: 404 };
    }
    // Allow deletion if the user is the task owner or an admin
    if (task.createdBy.toString() !== userId && userRole !== "admin") {
      throw { reason: "Unauthorized to delete this task", statusCode: 403 };
    }
    await Task.findByIdAndDelete(taskId);
    return task;
  }
  catch (error) {
    throw error;
  }
}

export {
  createTask,
  taskService,
};
