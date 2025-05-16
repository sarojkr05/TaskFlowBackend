import {
  createProject,
  getProjectById,
} from "../repository/projectRepository.js";
import * as projectRepository from "../repository/projectRepository.js";
import BadRequestError from "../utils/badRequestError.js";
import InternalServerError from "../utils/internalSeverError.js";


export async function createProjectService(userId, name, description) {
  try {

    // Ensure required fields are provide 
    if(!userId || !name || !description) {
      throw new BadRequestError(["UserId, Name and Description are required"])
    }

    const project = await createProject({
      name,
      description,
      createdBy: userId,
    });

    return project;
  } catch (error) {
    console.error("Error creating project:", error);

    // Handle specific known errors
    if (error.name === "ValidationError") {
      throw new BadRequestError(["Invalid project data"]);
    }
    throw new InternalServerError("Something went wrong while creating the project.")
  }
}

export async function getProjectByIdService(projectId) {
  try {
    const project = await getProjectById(projectId);
    console.log(project);
    if (!project) throw new Error("Project not found");
    return project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Error fetching project");
  }
}

export async function addUserToProjectService(projectId, userId) {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { reason: "Project not found", statusCode: 404 };

  return await projectRepository.addUserToProject(projectId, userId);
}

export async function removeUserFromProjectService(adminId, projectId, userId) {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { reason: "Project not found", statusCode: 404 };

  if (project.createdBy.toString() !== adminId) {
    throw { reason: "Not authorized to remove users", statusCode: 403 };
  }

  // Extract _id from members (since members are populated)
  const memberIds = project.members.map(member => member._id.toString());

  console.log("Project member IDs:", memberIds);
  console.log("User ID to remove:", userId);

  if (!memberIds.includes(userId)) {
    throw { reason: "User is not a member of this project", statusCode: 400 };
  }

  return await projectRepository.removeUserFromProject(projectId, userId);
}