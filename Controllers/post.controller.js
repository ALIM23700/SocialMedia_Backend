const Post = require("../Models/post.model");
const User = require("../Models/user.model");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { mediaType, mediaUrl, caption } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!mediaType || !mediaUrl) {
      return res.status(422).json({ message: "mediaType and mediaUrl are required" });
    }

    const post = await Post.create({
      user: req.user._id,
      mediaType,
      mediaUrl,
      caption: caption || "",
    });

    res.status(201).json({
      success: true,
      message: "post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Get a post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage");

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Update a post (caption only)
const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "forbidden: not your post" });
    }

    post.caption = caption || post.caption;
    await post.save();

    res.status(200).json({
      success: true,
      message: "post updated successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Like or unlike a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const userId = req.user._id.toString();
    const index = post.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: index === -1 ? "post liked" : "post unliked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// Add comment to a post
const commentPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(422).json({ message: "comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    post.comments.push({ user: req.user._id, text });
    await post.save();

    const populatedPost = await Post.findById(req.params.id)
      .populate("comments.user", "username profileImage");

    res.status(200).json({
      success: true,
      message: "comment added",
      comments: populatedPost.comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  likePost,
  commentPost,
};
