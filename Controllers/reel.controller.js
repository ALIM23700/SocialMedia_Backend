const Reel = require("../Models/reel.model");
const Notification = require("../Models/notification.model"); // added for notification

// CREATE REEL
const createReel = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Unauthorized" });

    const { caption } = req.body;

    if (!req.file) 
      return res.status(422).json({ message: "Media file is required" });

    const videoUrl = req.file.path;

    const reel = await Reel.create({
      user: req.user._id,
      videoUrl,
      caption: caption || "",
    });

    res.status(201).json({ success: true, message: "Reel created", reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL REELS
const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET REEL BY ID
const getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    if (!reel) return res.status(404).json({ message: "Reel not found" });

    res.status(200).json({ success: true, reel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIKE / UNLIKE REEL
const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const userId = req.user._id.toString();
    const index = reel.likes.findIndex(id => id.toString() === userId);

    let action = "";
    if (index === -1) {
      reel.likes.push(userId);
      action = "like";

      // Notification logic
      if (reel.user.toString() !== userId) {
        await Notification.create({
          sender: userId,
          receiver: reel.user,
          type: "like",
          reel: reel._id,
          message: "liked your reel"
        });
      }

    } else {
      reel.likes.splice(index, 1);
      action = "unlike";
    }

    await reel.save();

    res.status(200).json({
      success: true,
      message: action === "like" ? "Reel liked" : "Reel unliked",
      likesCount: reel.likes.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// COMMENT ON REEL
const commentReel = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(422).json({ message: "Comment text required" });

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    reel.comments.push({ user: req.user._id, text });
    await reel.save();

    // Notification logic
    const userId = req.user._id.toString();
    if (reel.user.toString() !== userId) {
      await Notification.create({
        sender: userId,
        receiver: reel.user,
        type: "comment",
        reel: reel._id,
        message: "commented on your reel"
      });
    }

    const populatedReel = await Reel.findById(req.params.id)
      .populate("comments.user", "username profileImage");

    res.status(200).json({ success: true, message: "Comment added", comments: populatedReel.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// VIEW REEL
const viewReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: "Reel not found" });

    const userId = req.user._id.toString();
    if (!reel.views.includes(userId)) reel.views.push(userId);

    await reel.save();

    res.status(200).json({ success: true, message: "Reel viewed", viewsCount: reel.views.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReel,
  getAllReels,
  getReelById,
  likeReel,
  commentReel,
  viewReel,
};