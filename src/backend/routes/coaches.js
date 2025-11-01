const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const coachCtrl = require("../controllers/coachController");

// Protect all routes - only coach can access
router.use(protect, allowRoles("coach"));

// ---------- STUDENTS ----------
router.get("/students", coachCtrl.getAllStudents); // View all students
router.get("/students/assigned", coachCtrl.getAssignedStudents); // Get assigned students

// ---------- ATTENDANCE ----------
router.post("/attendance", coachCtrl.markAttendance); // Mark attendance with date
router.post("/attendance/bulk", coachCtrl.markBulkAttendance); // Mark multiple students at once
router.get("/attendance", coachCtrl.getAllAttendance); // Get all attendance records
router.get("/attendance/:studentId", coachCtrl.getStudentAttendance); // Get attendance for specific student

// ---------- FEES COLLECTION ----------
router.post("/fees/collect", coachCtrl.markFeeCollection); // Mark fee collection (cash received)
router.get("/fees", coachCtrl.getFeeRecords); // Get fee records

module.exports = router;
