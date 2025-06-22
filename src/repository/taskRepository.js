// taskRepository.js
import Task from "../schemas/taskSchema.js";

const taskRepository = {
  getTasksByUserId: async (userId) => {
    return await Task.find({ createdBy: userId }).populate("assignedTo", "name email");
  },

  getTaskById: async (taskId) => {
    return await Task.findById(taskId).populate("assignedTo", "name email");
  },
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const task = await Task.findByIdAndUpdate(taskId, updatedData, { new: true, runValidators: true });
    return task;
  } catch (error) {
    throw new Error("Error updating task");
  }
};

export const deleteTask = async (taskId) => {
  try {
    const task = await Task.findByIdAndDelete(taskId);
    return task;
  } catch (error) {
    throw new Error("Error deleting task");
  }
};

export default taskRepository; // CORRECT way to export the object
