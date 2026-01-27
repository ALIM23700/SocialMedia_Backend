const Reel = require("../Models/reel.model");
const User = require("../Models/user.model");

// Create a new Reel
const createReel = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const { caption } = req.body;
    if (!req.file) {
      return res.status(422).json({ message: "media file is required" });
    }

    const mediaUrl = req.file.path; // Cloudinary URL from multer
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const reel = await Reel.create({
      user: req.user._id,
      mediaType,
      mediaUrl,
      caption: caption || "",
    });

    res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Get all Reels
const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Get Reel by ID
const getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }

    res.status(200).json({
      success: true,
      reel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Like/Unlike a Reel
const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }

    const userId = req.user._id.toString();
    const index = reel.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      reel.likes.push(userId);
    } else {
      reel.likes.splice(index, 1);
    }

    await reel.save();

    res.status(200).json({
      success: true,
      message: index === -1 ? "Reel liked" : "Reel unliked",
      likesCount: reel.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Comment on a Reel
const commentReel = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(422).json({ message: "comment text is required" });
    }

    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: "reel not found" });
    }

    reel.comments.push({ user: req.user._id, text, createAt: new Date() });
    await reel.save();

    const populatedReel = await Reel.findById(req.params.id)
      .populate("comments.user", "username profileImage");

    res.status(200).json({
      success: true,
      message: "comment added",
      comments: populatedReel.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createReel,
  getAllReels,
  getReelById,
  likeReel,
  commentReel,
};
