const Notification = require("../Models/notification.model");
const User = require("../Models/user.model");
const Post = require("../Models/post.model");
const Reel = require("../Models/reel.model");
const Story = require("../Models/story.model");

// ================= GET USER NOTIFICATIONS =================
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch notifications for this user, newest first
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "username profileImage")
      .populate("post", "mediaType mediaUrl caption")
      .populate("reel", "videoUrl caption")
      .populate("story", "mediaType mediaUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// ================= MARK NOTIFICATION AS READ =================
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    if (notification.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

module.exports = { getNotifications, markAsRead };