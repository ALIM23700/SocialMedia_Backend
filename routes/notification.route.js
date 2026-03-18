const { Router } = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
} = require("../Controllers/notification.controller");

const router5 = Router();

// GET all notifications for logged-in user
router5.get("/notifications", authMiddleware, getNotifications);

// PUT mark notification as read
router5.put("/notifications/:id/read", authMiddleware, markAsRead);

module.exports = router5;