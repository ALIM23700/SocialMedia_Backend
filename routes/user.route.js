const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  profileUser,
  allUsers,
  uploadProfile,
  toggleFollow
} = require("../Controllers/user.controller");

const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload");

const router = Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Profile
router.get("/profile", authMiddleware, profileUser);
router.post("/updateProfile", authMiddleware, upload.single("profileImage"), uploadProfile);

// Users
router.get("/all", allUsers);

// Follow / Unfollow
router.post("/follow/:targetUserId", authMiddleware, toggleFollow);

module.exports = router;