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

router4.post("/story/create", authMiddleware, upload.single("media"), createStory);

router4.get("/allstory", getAllStories);


router4.put("/story/view/:id", authMiddleware, viewStory);

router4.put("/story/like/:id", authMiddleware, likeStory);


router4.post("/story/comment/:id", authMiddleware, commentStory);

module.exports = router4;
