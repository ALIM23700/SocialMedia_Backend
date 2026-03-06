const Story = require("../Models/story.model");

// ================= CREATE STORY =================
const createStory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!req.file) {
      return res.status(422).json({ message: "media file is required" });
    }

    const mediaUrl = req.file.path;
    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const story = await Story.create({
      user: req.user._id,
      mediaType,
      mediaUrl,
    });

    res.status(201).json({
      success: true,
      message: "story created successfully",
      story,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// ================= GET ALL STORIES =================
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "username profileImage") // story owner
      .populate("comments.user", "username profileImage") // commenters
      .populate("likes", "username profileImage") // users who liked
      .populate("viewers", "username profileImage") // users who viewed
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// ================= VIEW STORY =================
const viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "story not found" });

    const userId = req.user._id.toString();

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    const populatedStory = await Story.findById(req.params.id).populate(
      "viewers",
      "username profileImage"
    );

    res.status(200).json({
      success: true,
      message: "story viewed",
      viewers: populatedStory.viewers,
      viewersCount: populatedStory.viewers.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// ================= LIKE / UNLIKE STORY =================
const likeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "story not found" });

    const userId = req.user._id.toString();
    const index = story.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      story.likes.push(userId);
    } else {
      story.likes.splice(index, 1);
    }

    await story.save();

    const populatedStory = await Story.findById(req.params.id).populate(
      "likes",
      "username profileImage"
    );

    res.status(200).json({
      success: true,
      message: index === -1 ? "story liked" : "story unliked",
      likes: populatedStory.likes,
      likesCount: populatedStory.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// ================= COMMENT ON STORY =================
const commentStory = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(422).json({ message: "comment text is required" });

    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "story not found" });

    story.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    });

    await story.save();

    const populatedStory = await Story.findById(req.params.id).populate(
      "comments.user",
      "username profileImage"
    );

    res.status(200).json({
      success: true,
      message: "comment added",
      comments: populatedStory.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createStory,
  getAllStories,
  viewStory,
  likeStory,
  commentStory,
};