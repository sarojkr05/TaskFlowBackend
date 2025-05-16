import Project from "../schemas/projectSchema.js";
import BadRequestError from "../utils/badRequestError.js";

export async function createProject(data) {
  if(!data) {
    throw new BadRequestError(["Data is required in create project repo"]);
  }
  const response =  await Project.create(data);
  return response;
}

export async function getProjectById(id) {
  return await Project.findById(id)
    .populate("admins", "name email")  // ✅ Populate admins (to check admin access)
    .populate("members", "name email"); // ✅ Populate members (if needed)
}

export async function addUserToProject(projectId, userId) {
  return await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } }, // Prevents duplicate entries
      { new: true }
  );
}

export async function removeUserFromProject(projectId, userId) {
  return await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } }, // Removes the user from the member array
      { new: true }
  );
}