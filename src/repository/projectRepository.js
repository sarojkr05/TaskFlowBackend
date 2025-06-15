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

export const findProjectById = (id, populate = false) => {
  if (populate) return Project.findById(id).populate('members', 'email name');
  return Project.findById(id);
};

export const updateProjectMembers = (id, members) => {
  return Project.findByIdAndUpdate(id, { members }, { new: true });
};


export async function removeUserFromProject(projectId, userId) {
  return await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: userId } },
    { new: true }
  );
}

export async function getAllProjects(userId) {
  try {
    return await Project.find({
      $or: [{ createdBy: userId }, { members: userId }]
    })
    .populate("members", "name email")
  } catch (error) {
    console.log("Error fetching all the projects")
  }
}

export async function updateProject(projectId, updateData) {
  try {
    return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
  } catch (error) {
    console.log("Error updating the project")
  }
}

export async function deleteProject(projectId) {
  try {
    return await Project.findByIdAndDelete(projectId);
  } catch (error) {
    console.log("Error deleting the project")
  }
}