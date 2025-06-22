import {
  createProject,
  getProjectById,
} from "../repository/projectRepository.js";
import * as projectRepository from "../repository/projectRepository.js";
import { findUserByEmail } from "../repository/userRepository.js";
import BadRequestError from "../utils/badRequestError.js";
import InternalServerError from "../utils/internalSeverError.js";

export async function createProjectService(userId, name, description) {
  try {
    // Ensure required fields are provide
    if (!userId || !name || !description) {
      throw new BadRequestError(["UserId, Name and Description are required"]);
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
    throw new InternalServerError(
      "Something went wrong while creating the project."
    );
  }
}

export async function getProjectByIdService(projectId) {
  try {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    return project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Error fetching project");
  }
}

export const addMemberToProjectService = async (projectId, email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const project = await projectRepository.findProjectById(projectId);
  if (!project) throw new Error("Project not found");

  if (project.members.includes(user._id))
    throw new Error("User already a member");

  project.members.push(user._id);
   const savedProjct = await project.save();
   return { updatedProject: savedProjct, user };
};

export const getProjectMembersService = async (projectId, userId) => {
  const project = await projectRepository.findProjectById(projectId, true); // populated

  if (!project) {
    throw new Error("Project not found");
  }

  const isCreator = project.createdBy.toString() === userId.toString();
  const isMember = project.members.some(
    (member) => member._id.toString() === userId.toString()
  );

  if (!isCreator && !isMember) {
    throw new Error("You are not authorized to view this project's members");
  }

  return project.members;
};

export async function removeUserFromProjectService(adminId, projectId, userId) {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { reason: "Project not found", statusCode: 404 };

  if (project.createdBy.toString() !== adminId) {
    throw { reason: "Not authorized to remove users", statusCode: 403 };
  }

  const memberIds = project.members.map((member) =>
    typeof member === "object" ? member._id.toString() : member.toString()
  );
  if (!memberIds.includes(userId)) {
    throw { reason: "User is not a member of this project", statusCode: 400 };
  }

  // Optional: Prevent removing the project owner
  if (userId === adminId) {
    throw { reason: "Project owner cannot remove themselves", statusCode: 400 };
  }

  return await projectRepository.removeUserFromProject(projectId, userId);
}

export async function getAllProjectsService(userId) {
  try {
    return await projectRepository.getAllProjects(userId);
  } catch (error) {
    console.error("Error getting all projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function updateProjectService(projectId, updateData) {
  try {
    return await projectRepository.updateProject(projectId, updateData);
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
}

export async function deleteProjectService(projectId) {
  try {
    return await projectRepository.deleteProject(projectId);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
}
