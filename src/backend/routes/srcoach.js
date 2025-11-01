const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { allowRoles } = require("../middleware/roles");
const srCoachCtrl = require("../controllers/srCoachController");

// Protect all routes - only seniorCoach can access
router.use(protect, allowRoles("seniorCoach"));

// ---------- STUDENT MANAGEMENT ----------
router.post("/students", srCoachCtrl.addStudent);
router.get("/students", srCoachCtrl.getAllStudents);
router.get("/students/:id/credentials", srCoachCtrl.getStudentCredentials);
router.put("/students/:id", srCoachCtrl.updateStudent);
router.delete("/students/:id", srCoachCtrl.deleteStudent);

// ---------- STUDENT FEES SETTING ----------
router.put("/students/:id/fees", srCoachCtrl.setStudentFees);

// ---------- COACH MANAGEMENT ----------
router.post("/coaches", srCoachCtrl.addCoach);
router.get("/coaches", srCoachCtrl.getAllCoaches);
router.put("/coaches/:id", srCoachCtrl.updateCoach);
router.delete("/coaches/:id", srCoachCtrl.deleteCoach);

// ---------- DASHBOARD & REPORTS ----------
router.get("/dashboard/stats", srCoachCtrl.getDashboardStats);
router.get("/report", srCoachCtrl.overallReport); // Backward compatibility

// ---------- FEES REPORTS ----------
router.get("/fees/report", srCoachCtrl.getFeesReport);
router.get("/fees/pending", srCoachCtrl.getPendingFees);
router.get("/fees/collected", srCoachCtrl.getCollectedFees);
router.put("/fees/:feeId/collect", srCoachCtrl.markFeeCollected);

// ---------- ATTENDANCE REPORTS ----------
router.get("/attendance/report", srCoachCtrl.getAttendanceReport);

module.exports = router;
