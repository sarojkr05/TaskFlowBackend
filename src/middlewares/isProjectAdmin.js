import Project from "../schemas/projectSchema.js";

export const isProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.body.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only project admin can perform this action",
        });
    }

    // Allow access
    next();
  } catch (error) {
    console.error("❌ Error in isProjectAdmin middleware:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
