import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Add new user (Student/Coach)
router.post("/add-user", protect, async (req, res) => {
  try {
    const { username, password, role, batch, email } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role,
      batch,
      email,
    });

    await user.save();

    // ✅ Return the plain password to display in modal
    res.status(201).json({
      message: `${role} added successfully`,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        batch: user.batch,
        email: user.email,
        password, // plain password to show once
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add user", error });
  }
});

export default router;
