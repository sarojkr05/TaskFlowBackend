import Notification from "../schemas/notificationSchema.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Batch mark all unread notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    const updatedNotifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications: updatedNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

