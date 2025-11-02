const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Get student profile with populated user data
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate("user", "username role")
      .populate("attendanceRecords");

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json({
      ...student.toObject(),
      username: student.user.username,
      profilePhotoUrl: student.profilePhotoUrl ? `http://localhost:5000${student.profilePhotoUrl}` : null,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      message: "Error fetching profile",
      error: err.message,
    });
  }
};

// Update student profile (students can update their own profile)
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "address",
      "profilePhotoUrl",
      "dob",
      "gender",
      "extraInfo",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await Student.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    )
      .populate("user", "username role")
      .populate("attendanceRecords");

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      student: {
        ...student.toObject(),
        username: student.user.username,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: "Error updating profile",
      error: err.message,
    });
  }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePhotoUrl = `/uploads/profile-photos/${req.file.filename}`;

    const student = await Student.findOneAndUpdate(
      { user: req.user._id },
      { profilePhotoUrl },
      { new: true, runValidators: true }
    )
      .populate("user", "username role");

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json({
      message: "Profile photo uploaded successfully",
      student: {
        ...student.toObject(),
        username: student.user.username,
        profilePhotoUrl: `http://localhost:5000${profilePhotoUrl}`,
      },
    });
  } catch (err) {
    console.error("Upload Profile Photo Error:", err);
    res.status(500).json({
      message: "Error uploading profile photo",
      error: err.message,
    });
  }
};

// Get student fees with detailed information
exports.getFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const fees = await Fee.find({ student: student._id })
      .populate("collectedBy", "username")
      .sort({ date: -1 });

    // Calculate summary
    const collectedFees = fees.filter((f) => f.status === "collected");
    const pendingFees = fees.filter((f) => f.status === "pending");

    const totalCollected = collectedFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPending = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

    res.json({
      studentFee: {
        monthlyFee: student.monthlyFee,
        feeDuration: student.feeDuration,
      },
      fees,
      summary: {
        totalCollected,
        totalPending,
        collectedCount: collectedFees.length,
        pendingCount: pendingFees.length,
      },
    });
  } catch (err) {
    console.error("Get Fees Error:", err);
    res.status(500).json({
      message: "Error fetching fees",
      error: err.message,
    });
  }
};

// Get student attendance with detailed information
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const { startDate, endDate, status } = req.query;

    let query = { student: student._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate("coach", "username")
      .sort({ date: -1 });

    // Calculate summary
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const leave = attendance.filter((a) => a.status === "leave").length;

    res.json({
      attendance,
      summary: {
        total: attendance.length,
        present,
        absent,
        leave,
        attendancePercentage:
          attendance.length > 0
            ? ((present / attendance.length) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (err) {
    console.error("Get Attendance Error:", err);
    res.status(500).json({
      message: "Error fetching attendance",
      error: err.message,
    });
  }
};

// Get student dashboard summary
exports.getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate("user", "username role");

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Get recent attendance (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAttendance = await Attendance.countDocuments({
      student: student._id,
      date: { $gte: thirtyDaysAgo },
    });

    const presentCount = await Attendance.countDocuments({
      student: student._id,
      date: { $gte: thirtyDaysAgo },
      status: "present",
    });

    // Get fee status
    const pendingFees = await Fee.find({
      student: student._id,
      status: "pending",
    });

    const totalPending = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

    res.json({
      profile: {
        ...student.toObject(),
        username: student.user.username,
      },
      stats: {
        recentAttendance: {
          total: recentAttendance,
          present: presentCount,
          percentage:
            recentAttendance > 0
              ? ((presentCount / recentAttendance) * 100).toFixed(2)
              : 0,
        },
        fees: {
          monthlyFee: student.monthlyFee,
          feeDuration: student.feeDuration,
          pendingAmount: totalPending,
          pendingCount: pendingFees.length,
        },
      },
    });
  } catch (err) {
    console.error("Get Dashboard Error:", err);
    res.status(500).json({
      message: "Error fetching dashboard",
      error: err.message,
    });
  }
};
