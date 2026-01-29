const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  profileUser,
  allUsers,
 
  uploadProfile 
} = require("../Controllers/user.controller");

const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/cloudnaryUpload"); 

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", authMiddleware, profileUser);
router.post("/updateProfile", authMiddleware, upload.single("profileImage"),
uploadProfile );
router.get("/all", allUsers);

module.exports = router;
