const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get notifications for a specific user
router.get("/:profileId", notificationController.getNotifications);

// Mark a notification as read
router.put(
  "/:notificationId/read",
  notificationController.markNotificationAsRead,
);

// Delete a notification
router.delete("/:notificationId", notificationController.deleteNotification);

module.exports = router;
