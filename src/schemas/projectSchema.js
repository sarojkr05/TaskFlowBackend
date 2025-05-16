
import mongoose from "mongoose";

// Define the schema for a project
const projectSchema = new mongoose.Schema(
  {
    // Basic project details
    name: { type: String, required: true },
    description: { type: String },

    // User relationships
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true
  }
);

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);
export default Project;
// This schema defines the structure of a project document in the MongoDB database.
// It includes fields for the project name, description, and relationships to users (createdBy, admins, members).