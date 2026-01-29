const { Router } = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload");
const {
  createReel,
  getAllReels,
  getReelById,
  likeReel,
  commentReel,
  viewReel,
} = require("../Controllers/reel.controller");

const router3 = Router();

router3.post("/reel/create", authMiddleware, upload.single("media"), createReel);//ok
router3.get("/allreel", getAllReels);//ok
router3.get("/reel/:id", getReelById);//ok
router3.put("/reel/like/:id", authMiddleware, likeReel);//ok
router3.post("/reel/comment/:id", authMiddleware, commentReel);//ok
router3.put("/reel/view/:id", authMiddleware, viewReel);//ok

module.exports = router3;
