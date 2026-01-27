const { Router } = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload");
const {
  createReel,
  getAllReels,
  getReelById,
  likeReel,
  commentReel,
} = require("../Controllers/reel.controller");

const router3 = Router();

// Create Reel (image/video)
router3.post("/create", authMiddleware, upload.single("media"), createReel);

// Get all Reels
router3.get("/", getAllReels);

// Get Reel by ID
router3.get("/:id", getReelById);

// Like/Unlike Reel
router3.put("/like/:id", authMiddleware, likeReel);

// Comment on Reel
router3.post("/comment/:id", authMiddleware, commentReel);

module.exports = router3;
