import User from "../Models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
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
    res.status(500).json({ message: "server error" })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(422).json({ message: "all fields are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" })
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5y" }
    )

    const options = {
      httpOnly: true,
      maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict"
    }

    const { password: pass, ...rest } = user._doc

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        message: "login successfully",
        user: rest
      })
  } catch (error) {
    res.status(500).json({ message: "error with login" })
  }
}

export const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "Strict"
    }

    res
      .status(200)
      .clearCookie("token", options)
      .json({
        success: true,
        message: "logout successfully"
      })
  } catch (error) {
    res.status(500).json({ message: "logout error" })
  }
}

export const profileUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
}

export const allUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    res.status(500).json({ message: "server error" })
  }
}
