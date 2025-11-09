const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const studentCtrl = require("../controllers/studentController");

// Protect all routes - only students can access
router.use(protect, allowRoles("student"));

// ---------- PROFILE ----------
const upload = require("../middleware/upload");
router.get("/profile", studentCtrl.getProfile); // Get student profile (including photo)
router.put("/profile", studentCtrl.updateProfile); // Update own profile
router.post("/profile/photo", upload.single('profilePhoto'), studentCtrl.uploadProfilePhoto); // Upload profile photo

// ---------- DASHBOARD ----------
router.get("/dashboard", studentCtrl.getDashboard); // Get dashboard with summary

// ---------- FEES ----------
router.get("/fees", studentCtrl.getFees); // Get fees report

// ---------- ATTENDANCE ----------
router.get("/attendance", studentCtrl.getAttendance); // Get attendance report

module.exports = router;
