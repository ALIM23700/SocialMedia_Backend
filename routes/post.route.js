const { Router } = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload"); 

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  likePost,
  commentPost,
} = require("../Controllers/post.controller");

const router2 = Router();

// Create a new post
router2.post("/create", authMiddleware, createPost);

// Get all posts
router2.get("/all", getAllPosts);

// Get a post by ID
router2.get("/:id", getPostById);

// Update a post (caption only)
router2.put("/update/:id", authMiddleware, updatePost);

// Like or unlike a post
router2.put("/like/:id", authMiddleware, likePost);

// Add a comment to a post
router2.post("/comment/:id", authMiddleware, commentPost);

module.exports = router2;
