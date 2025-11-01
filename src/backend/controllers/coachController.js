const Coach = require("../models/Coach");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");

/**
 * @desc Get coach profile
 * @route GET /api/coach/me
 */
exports.getCoachProfile = async (req, res) => {
  try {
    const coach = await Coach.findById(req.user.id).select("-password");
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    res.status(200).json(coach);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc List all students assigned to the coach
 * @route GET /api/coach/me/students
 */
exports.listStudents = async (req, res) => {
  try {
    // Assuming students have a `coachId` field in their model
    const students = await Student.find({ coachId: req.user.id });
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Mark student attendance
 * @route POST /api/coach/attendance
 * @body { studentId, status (present/absent), date }
 */
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendance = new Attendance({
      studentId,
      coachId: req.user.id,
      date: date || new Date(),
      status,
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Mark fee collection for a student
 * @route POST /api/coach/fee
 * @body { studentId, amount, date }
 */
exports.markFee = async (req, res) => {
  try {
    const { studentId, amount, date } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const fee = new Fee({
      studentId,
      coachId: req.user.id,
      date: date || new Date(),
      amount,
    });

    await fee.save();
    res.status(201).json({ message: "Fee marked", fee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
