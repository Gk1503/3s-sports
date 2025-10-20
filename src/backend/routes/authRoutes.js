import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Register user (only once to create accounts)
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, photo } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role,
      photo,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// 🔹 Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({ username, role });
    if (!user) return res.status(400).json({ message: "Invalid username or role" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, photo, batch, batchTime } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role,
      photo,
      batch,
      batchTime
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export default router;
