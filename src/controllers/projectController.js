import { io, onlineUsers } from "../server.js";
import Notification from "../schemas/notificationSchema.js";
import {
  addMemberToProjectService,
  createProjectService,
  deleteProjectService,
  getAllProjectsService,
  getProjectByIdService,
  getProjectMembersService,
  removeUserFromProjectService,
  updateProjectService,
} from "../services/projectService.js";

export async function createProjectController(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // Extracted from authentication middleware
    const userRole = req.user.role;
    const project = await createProjectService(userId, name, description);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getProjectByIdController = async (req, res) => {
  try {
    const project = await getProjectByIdService(req.params.id);
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const addMemberToProjectController = async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  try {
    const { updatedProject, user } = await addMemberToProjectService(projectId, email);
    // save notification to DB
    const notification = await Notification.create({
      user: user._id,
      message: `You were added to project: ${updatedProject.name}`,
      project: updatedProject._id
    });

    const socketId = onlineUsers.get(user._id.toString());
    if (socketId) {
      io.to(socketId).emit("projectAdded", {
        message: notification.message,
        projectId: updatedProject._id,
      });
    }
    res.status(200).json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getProjectMembersController = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  try {
    const members = await getProjectMembersService(projectId, userId);
    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};
export async function removeUserFromProjectController(req, res) {
  try {
    const { id: projectId, userId } = req.params; // projectId from URL param
    const adminId = req.user.id; // from auth middleware

    const updatedProject = await removeUserFromProjectService(
      adminId,
      projectId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "User removed from project successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error in removeUserFromProjectController:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.reason || "Internal Server Error",
    });
  }
}

export async function getAllProjectsController(req, res) {
  try {
    const userId = req.user.id;
    const projects = await getAllProjectsService(userId);
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await updateProjectService(id, updateData);
    res
      .status(200)
      .json({ success: true, message: "Project updated", project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;
    await deleteProjectService(id);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
