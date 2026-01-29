
const User = require("../Models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    if (!username || !email || !password) {
      return res.status(422).json({ message: "all fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" })
    }

    const hashedPassword = bcrypt.hashSync(password, 8)

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    const { password: pass, ...rest } = user._doc

    res.status(201).json({
      success: true,
      message: "registered successfully",
      user: rest
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server error" })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(422).json({ success: false, message: "All fields are required" })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    const options = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    }

    const { password: pass, ...rest } = user._doc

    res.status(200)
      .cookie("token", token, options)
      .json({ success: true, message: "Login successful", user: rest })

  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Error with login" })
  }
}


const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Logout error" });
  }
};


const profileUser = async (req, res) => {
  try {
    const userId = req.user?._id;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(userId).select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const uploadProfile = async (req, res) => {
    const userId=req.user?._id;
  try {
    const profileImage=req.file?.path;
   
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" });
    }

    
    if (!profileImage) {
      return res.status(400).json({ message: "no file uploaded" });
    }
  const  uploadProfile=await User.findByIdAndUpdate(
    userId,
    {profileImage},
    {new:true}
  ).select("-password")
    res.status(200).json({
      success: true,
      message:"Profile image updated",
      user: uploadProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "upload failed" });
  }
};


const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server error" })
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  profileUser,

   uploadProfile ,
  allUsers
}
