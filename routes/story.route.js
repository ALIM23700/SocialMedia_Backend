const { Router } = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload");

const {
  createStory,
  getAllStories,
  viewStory,
  likeStory,
  commentStory,
} = require("../Controllers/story.controller");

const router4 = Router();

// Create story
router4.post("/create", authMiddleware, upload.single("media"), createStory);

// Get all stories
router4.get("/", getAllStories);

// View story
router4.put("/view/:id", authMiddleware, viewStory);

// Like / unlike story
router4.put("/like/:id", authMiddleware, likeStory);

// Comment on story
router4.post("/comment/:id", authMiddleware, commentStory);

module.exports = router4;
