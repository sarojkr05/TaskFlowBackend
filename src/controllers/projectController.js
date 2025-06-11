import { addUserToProjectService, createProjectService, deleteProjectService, getAllProjectsService, getProjectByIdService, removeUserFromProjectService, updateProjectService } from "../services/projectService.js";

export async function createProjectController(req, res) {
    try {
        const { name, description } = req.body;
        const userId = req.user.id; // Extracted from authentication middleware
        const userRole = req.user.role;

        // if (userRole !== "admin") {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Unauthorized to create a project",
        //     });
        // }

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
export async function addUserToProjectController(req, res) {
    try {
        const { id } = req.params; // Project ID
        const { userId } = req.body; // User to be added

        const updatedProject = await addUserToProjectService(id, userId);

        res.status(200).json({
            success: true,
            message: "User added to project successfully",
            project: updatedProject
        });
    } catch (error) {
        console.error("Error in addUserToProjectController:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.reason || "Internal Server Error"
        });
    }
}


export async function removeUserFromProjectController(req, res) {
    try {
        const { id, userId } = req.params; // Project ID from URL
        // const { userId } = req.body; // User ID to remove
        console.log("userId from controller", userId);
        const adminId = req.user.id; // Extracted from authentication middleware

        const updatedProject = await removeUserFromProjectService(adminId, id, userId);

        res.status(200).json({
            success: true,
            message: "User removed from project successfully",
            project: updatedProject
        });
    } catch (error) {
        console.error("Error in removeUserFromProjectController:", error);
        res.status(error.statusCode || 500).json({ success: false, message: error.reason || "Internal Server Error" });
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
    res.status(200).json({ success: true, message: "Project updated", project: updated });
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
