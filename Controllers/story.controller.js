const Story = require("../Models/story.model");

// Create story (image / video)
const createStory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!req.file) {
      return res.status(422).json({ message: "media file is required" });
    }

    const mediaUrl = req.file.path;
    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

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

// Get all active stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
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

// View a story
const viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "story not found" });
    }

    const userId = req.user._id.toString();

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    res.status(200).json({
      success: true,
      message: "story viewed",
      viewersCount: story.viewers.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Like / Unlike story
const likeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "story not found" });
    }

    const userId = req.user._id.toString();
    const index = story.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      story.likes.push(userId);
    } else {
      story.likes.splice(index, 1);
    }

    await story.save();

    res.status(200).json({
      success: true,
      message: index === -1 ? "story liked" : "story unliked",
      likesCount: story.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Comment on story
const commentStory = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(422).json({ message: "comment text is required" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "story not found" });
    }

    story.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    });

    await story.save();

    const populatedStory = await Story.findById(req.params.id)
      .populate("comments.user", "username profileImage");

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
