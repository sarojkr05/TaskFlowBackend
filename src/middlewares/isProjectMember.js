import Project from "../schemas/projectSchema.js";

export const isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user.id;

    if (!req.params.projectId) {
      return res
        .status(400)
        .json({ message: "Project ID is missing in request" });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isCreator = project.createdBy.toString() === userId;
    const isAdmin = project.admins.some(
      (adminId) => adminId.toString() === userId
    );
    const isMember = project.members.some(
      (memberId) => memberId.toString() === userId
    );

    if (!isCreator && !isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You're not a member of this project",
      });
    }

    // Valid project member
    next();
  } catch (error) {
    console.log("Error in isProjectMember middleware", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
