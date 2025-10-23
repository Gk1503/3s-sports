import express from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to ensure user is logged in and is a 'coach' or 'srcoach'
const coachAccess = [protect, authorize("coach", "srCoach")];

// ==========================================================
// 1. Fetch All Students (For Coach Dashboard)
// GET /api/coach/coach-students
// ==========================================================
router.get("/coach-students", coachAccess, async (req, res) => {
  try {
    const students = await Student.find({})
      .populate("userId", "name role username")
      .lean();

    res.json(students);
  } catch (error) {
    console.error("Error fetching coach students:", error);
    res.status(500).json({ message: "Server error fetching student data." });
  }
});

// ==========================================================
// 2. Record Fee Payment
// POST /api/coach/students/:studentId/fee-payment
// ==========================================================
router.post("/students/:studentId/fee-payment", coachAccess, async (req, res) => {
  const { studentId } = req.params;
  const { amount, date } = req.body;

  if (!amount || !date) {
    return res.status(400).json({ message: "Amount and Date are required." });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Initialize feePayments if not present
    if (!student.feePayments) {
      student.feePayments = [];
    }

    // Add new payment
    student.feePayments.push({
      amount: Number(amount),
      date: new Date(date),
      recordedBy: req.user._id,
    });

    // Recalculate totals
    const totalPaid = student.feePayments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= student.fees.total) {
      student.feeStatus = "Paid";
      student.fees.paid = student.fees.total;
      student.fees.due = 0;
    } else {
      student.feeStatus = "Pending";
      student.fees.paid = totalPaid;
      student.fees.due = student.fees.total - totalPaid;
    }

    await student.save();

    res.status(201).json({
      message: "Fee payment recorded successfully.",
      payment: student.feePayments.slice(-1)[0],
      student,
    });
  } catch (error) {
    console.error("Error recording fee payment:", error);
    res.status(500).json({ message: "Server error recording payment." });
  }
});

// ==========================================================
// 3. Mark Attendance
// POST /api/coach/attendance
// ==========================================================
router.post("/attendance", coachAccess, async (req, res) => {
  const { studentId, date, status, batch } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ message: "Student, Date, and Status are required." });
  }

  const attendanceDate = new Date(date);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  try {
    const student = await Student.findById(studentId).populate("userId", "name");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const existingAttendance = await Attendance.findOne({
      studentId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      return res
        .status(409)
        .json({ message: `Attendance for ${student.userId.name} on ${date} already marked as ${existingAttendance.status}.` });
    }

    const newAttendance = new Attendance({
      studentId,
      studentName: student.userId.name,
      date: attendanceDate,
      status,
      batch: batch || student.batch,
      recordedBy: req.user._id,
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully.",
      attendance: newAttendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Attendance already recorded for this student on this date." });
    }
    res.status(500).json({ message: "Server error marking attendance." });
  }
});

// ==========================================================
// 4. Attendance Summary
// GET /api/coach/attendance/summary
// ==========================================================
router.get("/attendance/summary", coachAccess, async (req, res) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    const presentCount = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    const totalStudents = await Student.countDocuments({});

    res.json({
      presentToday: presentCount,
      totalStudents,
      date: today.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ message: "Server error fetching attendance summary." });
  }
});

// ==========================================================
// 5. Individual Student Attendance History
// GET /api/coach/attendance/:studentId
// ==========================================================
router.get("/attendance/:studentId", coachAccess, async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid Student ID format." });
  }

  try {
    const history = await Attendance.find({ studentId }).sort({ date: -1 }).lean();
    res.json(history || []);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ message: "Server error fetching attendance history." });
  }
});

export default router;
