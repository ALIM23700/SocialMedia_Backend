const { Router } = require("express");
const { registerUser, loginUser, logoutUser, profileUser } = require("../Controllers/user.controller");

const router=Router()

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.post("/profile",profileUser

    
);
