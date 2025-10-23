import express from 'express';
const router = express.Router();
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// @route   GET /api/students/me
// @desc    Get logged-in student's data
// @access  Private (Student)
router.get('/me', protect, authorize('student'), async (req, res) => {
  try {
    // Find the student record associated with the logged-in user's ID
    const student = await Student.findOne({ userId: req.user._id });
    
    if (student) {
      // Merge user's name/role with the student's specific data
      const studentData = {
          ...student.toObject(),
          name: req.user.name,
          role: req.user.role
      };
      res.json(studentData);
    } else {
      // If a student User exists but no Student data exists yet, return basic user info
      res.json({ name: req.user.name, role: req.user.role, message: "Student record not found, returning basic info." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching student data' });
  }
});

// NOTE: Profile update will be handled in srCoachRoutes for now for image upload complexity.
// However, a simple student update route can go here if the student can change non-SrCoach managed fields.

export default router;