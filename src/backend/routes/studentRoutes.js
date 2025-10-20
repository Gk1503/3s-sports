import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get student dashboard data
router.get("/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Student not found" });

    res.json({
      username: user.username,
      photo: user.photo,
      batch: user.batch,
      batchTime: user.batchTime,
      attendance: user.attendance,
      progress: user.progress,
      fees: user.fees
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student data", error });
  }
});

export default router;
