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


router2.post("/createpost", authMiddleware,upload.single("media"),createPost);

router2.get("/allpost",authMiddleware, getAllPosts);


router2.get("/post/:id",authMiddleware, getPostById);

router2.put("/updatepost/:id", authMiddleware, updatePost);

router2.put("/post/like/:id", authMiddleware, likePost);


router2.post("/post/comment/:id", authMiddleware, commentPost);

module.exports = router2;
