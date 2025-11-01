const Student = require('../models/Student');
const User = require('../models/User');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');

// get student profile by student user id
exports.getMyProfile = async (req, res) => {
  try {
    // req.user is the auth user. if role student, find student record by user
    const student = await Student.findOne({ user: req.user._id })
      .populate('fees')
      .populate('attendanceRecords');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// srcoach or coach can get any student's full profile by studentId
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('fees').populate('attendanceRecords');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update student (partial)
exports.updateStudent = async (req, res) => {
  try {
    const updates = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
