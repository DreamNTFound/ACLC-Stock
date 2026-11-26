const Notification = require("../models/notification");

// Get notifications for a specific user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      profileId: req.params.profileId,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true },
    );
    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read: ", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(
      req.params.notificationId,
    );
    res.json(notification);
  } catch (error) {
    console.error("Error deleting notification: ", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
