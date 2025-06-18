import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7 // Automatically delete after 7 days
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
