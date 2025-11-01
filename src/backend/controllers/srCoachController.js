const User = require('../models/User');
const Student = require('../models/Student');
const Coach = require('../models/Coach');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');

// SR Coach can add student with details and create username/password
exports.createStudentWithUser = async (req, res) => {
  try {
    const { username, password, studentData } = req.body;
    if (!username || !password || !studentData) return res.status(400).json({ message: 'username, password and studentData required' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'username exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, role: 'student', createdBy: req.user._id });

    const student = await Student.create({ user: user._id, ...studentData });
    res.status(201).json({ message: 'Student created', student, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCoachWithUser = async (req, res) => {
  try {
    const { username, password, coachData } = req.body;
    if (!username || !password || !coachData) return res.status(400).json({ message: 'username, password and coachData required' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'username exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, role: 'coach', createdBy: req.user._id });

    const coach = await Coach.create({ user: user._id, ...coachData });
    res.status(201).json({ message: 'Coach created', coach, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// overall fees & attendance report
// Query parameters: from, to (YYYY-MM-DD)
exports.overallReport = async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date('1970-01-01');
    const to = req.query.to ? new Date(req.query.to) : new Date();

    // total fees collected
    const fees = await Fee.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: null, totalCollected: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // attendance summary: present/absent counts
    const attendance = await Attendance.aggregate([
      { $match: { date: { $gte: from, $lte: to } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // counts
    const totalStudents = await Student.countDocuments();
    const totalCoaches = await Coach.countDocuments();

    res.json({
      period: { from, to },
      fees: fees[0] || { totalCollected: 0, count: 0 },
      attendance,
      totals: { totalStudents, totalCoaches }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// list all students created by this senior coach, with full student details
exports.listMyStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "user",
        match: { createdBy: req.user._id, role: "student" },
        select: "username name role createdBy"
      });

    // Filter out null (those not created by this srcoach)
    const myStudents = students.filter(s => s.user !== null);

    res.json(myStudents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// list all coaches created by this senior coach, with full coach details
exports.listMyCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find()
      .populate({
        path: "user",
        match: { createdBy: req.user._id, role: "coach" },
        select: "username name role createdBy"
      });

    const myCoaches = coaches.filter(c => c.user !== null);

    res.json(myCoaches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SR Coach can update their created users (partial)
exports.updateUserBySrCoach = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const user = await

    User.findOneAndUpdate({ _id: userId, createdBy: req.user._id }, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found or not authorized' });
    res.json(user);
  }
    catch (err) {
    res.status(500).json({ message: err.message });
    }
};
// SR Coach can delete their created users
exports.deleteUserBySrCoach = async (req, res) => {
    try {
    const userId = req.params.id;
    const user = await User.findOne
        
    AndDelete({ _id: userId, createdBy: req.user._id });
    if (!user) return res.status(404).json({ message: 'User not found or not authorized' });
    res.json({ message: 'User deleted' });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};
    