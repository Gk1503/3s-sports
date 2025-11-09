// controllers/srCoachController.js
const Student = require("../models/Student");
const Coach = require("../models/Coach");
const User = require("../models/User");
const Fee = require("../models/Fee");
const Attendance = require("../models/Attendance");
const bcrypt = require("bcryptjs");

// ---------- STUDENT MANAGEMENT ----------
exports.addStudent = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      batch,
      address,
      parentName,
      parentPhone,
      profilePhotoUrl,
      monthlyFee,
      feeDuration,
      extraInfo,
    } = req.body;

    if (!username || !password || !firstName) {
      return res.status(400).json({ message: "username, password, and firstName are required" });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create linked User first
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      passwordHash,
      role: "student",
      createdBy: req.user._id,
      temporaryPassword: password, // Store temporarily for display
    });

    // Create Student profile
    const student = await Student.create({
      user: user._id,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      batch,
      address,
      parentName,
      parentPhone,
      profilePhotoUrl,
      monthlyFee: monthlyFee || 0,
      feeDuration: feeDuration || "1m",
      extraInfo,
    });

    // Create pending fee record if monthlyFee is set
    if (monthlyFee && monthlyFee > 0) {
      await Fee.create({
        student: student._id,
        amount: monthlyFee,
        feeForMonths: feeDuration || "1m",
        date: new Date(),
        month: new Date().toISOString().slice(0, 7), // Current month in YYYY-MM format
        status: "pending",
      });
    }

    res.status(201).json({
      message: "Student added successfully",
      student: {
        ...student.toObject(),
        username,
        password, // Return password for display (only when created)
      },
    });
  } catch (err) {
    console.error("Add Student Error:", err);
    res.status(500).json({ message: "Failed to add student", error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "username role")
      .populate("attendanceRecords")
      .sort({ createdAt: -1 });

    // Include username and password for each student
    const studentsWithCredentials = await Promise.all(
      students.map(async (student) => {
        const user = await User.findById(student.user);
        return {
          ...student.toObject(),
          username: user.username,
          // Note: We cannot retrieve password as it's hashed, but we can note that it was set
        };
      })
    );

    res.json(studentsWithCredentials);
  } catch (err) {
    console.error("Get Students Error:", err);
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
};

exports.getStudentCredentials = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("user", "username temporaryPassword");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName || ""}`,
      username: student.user.username,
      password: student.user.temporaryPassword || "Password not available",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching student credentials", error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "username")
      .populate("attendanceRecords");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    console.error("Update Student Error:", err);
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete associated records
    await Fee.deleteMany({ student: student._id });
    await Attendance.deleteMany({ student: student._id });
    
    // Delete user account
    await User.findByIdAndDelete(student.user);
    
    // Delete student profile
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete Student Error:", err);
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
};

// Set/Update student fees
exports.setStudentFees = async (req, res) => {
  try {
    const { id } = req.params; // Get student ID from route params
    const { monthlyFee, feeDuration } = req.body;

    if (monthlyFee === undefined) {
      return res.status(400).json({ message: "monthlyFee is required" });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        monthlyFee,
        feeDuration: feeDuration || "1m",
      },
      { new: true }
    )
      .populate("user", "username");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student fees updated successfully",
      student: {
        ...student.toObject(),
        monthlyFee,
        feeDuration: feeDuration || "1m",
      },
    });
  } catch (err) {
    console.error("Set Student Fees Error:", err);
    res.status(500).json({ message: "Error setting student fees", error: err.message });
  }
};

// ---------- COACH MANAGEMENT ----------
exports.addCoach = async (req, res) => {
  try {
    const { username, password, name, email, phone, profilePhotoUrl } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ message: "username, password, and name are required" });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      passwordHash,
      role: "coach",
      createdBy: req.user._id,
      temporaryPassword: password, // Store temporarily for display
    });

    const coach = await Coach.create({
      user: user._id,
      name,
      email,
      phone,
      profilePhotoUrl,
    });

    res.status(201).json({
      message: "Coach added successfully",
      coach: {
        ...coach.toObject(),
        username,
        password, // Return password for display
      },
    });
  } catch (err) {
    console.error("Add Coach Error:", err);
    res.status(500).json({ message: "Failed to add coach", error: err.message });
  }
};

exports.getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find()
      .populate("user", "username role")
      .populate("assignedStudents", "firstName lastName")
      .sort({ createdAt: -1 });

    // Include username for each coach
    const coachesWithCredentials = await Promise.all(
      coaches.map(async (coach) => {
        const user = await User.findById(coach.user);
        return {
          ...coach.toObject(),
          username: user.username,
        };
      })
    );

    res.json(coachesWithCredentials);
  } catch (err) {
    console.error("Get Coaches Error:", err);
    res.status(500).json({ message: "Error fetching coaches", error: err.message });
  }
};

exports.getCoachCredentials = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).populate("user", "username temporaryPassword");
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.json({
      coachId: coach._id,
      coachName: coach.name || "N/A",
      username: coach.user.username,
      password: coach.user.temporaryPassword || "Password not available",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching coach credentials", error: err.message });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "username")
      .populate("assignedStudents", "firstName lastName");

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.json({ message: "Coach updated successfully", coach });
  } catch (err) {
    console.error("Update Coach Error:", err);
    res.status(500).json({ message: "Error updating coach", error: err.message });
  }
};

exports.deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    // Delete associated attendance records marked by this coach
    await Attendance.deleteMany({ coach: coach.user });

    // Delete user account
    await User.findByIdAndDelete(coach.user);

    // Delete coach profile
    await Coach.findByIdAndDelete(req.params.id);

    res.json({ message: "Coach deleted successfully" });
  } catch (err) {
    console.error("Delete Coach Error:", err);
    res.status(500).json({ message: "Error deleting coach", error: err.message });
  }
};

// ---------- DASHBOARD REPORTS ----------
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCoaches = await Coach.countDocuments();

    // Calculate total fees collection
    const feesStats = await Fee.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const collectedFees = feesStats.find((s) => s._id === "collected")?.totalAmount || 0;
    const pendingFees = feesStats.find((s) => s._id === "pending")?.totalAmount || 0;
    const totalFeesCollection = collectedFees;

    // Calculate attendance count
    const totalAttendanceRecords = await Attendance.countDocuments();
    const presentCount = await Attendance.countDocuments({ status: "present" });
    const absentCount = await Attendance.countDocuments({ status: "absent" });
    const leaveCount = await Attendance.countDocuments({ status: "leave" });

    res.json({
      counts: {
        totalStudents,
        totalCoaches,
      },
      fees: {
        totalCollection: totalFeesCollection,
        collected: collectedFees,
        pending: pendingFees,
        collectedCount: feesStats.find((s) => s._id === "collected")?.count || 0,
        pendingCount: feesStats.find((s) => s._id === "pending")?.count || 0,
      },
      attendance: {
        totalRecords: totalAttendanceRecords,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
      },
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Error generating dashboard stats", error: err.message });
  }
};

// ---------- FEES REPORT ----------
exports.getFeesReport = async (req, res) => {
  try {
    const { status, month, studentId } = req.query;

    let query = {};
    if (status) query.status = status;
    if (month) query.month = month;
    if (studentId) query.student = studentId;

    const fees = await Fee.find(query)
      .populate("student", "firstName lastName monthlyFee feeDuration")
      .populate("collectedBy", "username")
      .sort({ date: -1 });
    
    // Get coach names for collectedBy
    const Coach = require("../models/Coach");
    const feesWithCoachNames = await Promise.all(
      fees.map(async (fee) => {
        if (fee.collectedBy) {
          const userId = fee.collectedBy._id || fee.collectedBy;
          const coach = await Coach.findOne({ user: userId });
          const coachName = coach?.name || fee.collectedBy?.username || "-";
          return {
            ...fee.toObject(),
            collectedBy: {
              ...fee.collectedBy?.toObject(),
              name: coachName,
              username: fee.collectedBy?.username || coachName
            }
          };
        }
        return fee.toObject();
      })
    );

    // Calculate summary
    const summary = await Fee.aggregate([
      ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const collected = summary.find((s) => s._id === "collected")?.totalAmount || 0;
    const pending = summary.find((s) => s._id === "pending")?.totalAmount || 0;

    res.json({
      fees: feesWithCoachNames,
      summary: {
        total: collected + pending,
        collected,
        pending,
        collectedCount: summary.find((s) => s._id === "collected")?.count || 0,
        pendingCount: summary.find((s) => s._id === "pending")?.count || 0,
      },
    });
  } catch (err) {
    console.error("Fees Report Error:", err);
    res.status(500).json({ message: "Error generating fees report", error: err.message });
  }
};

// Get pending fees
exports.getPendingFees = async (req, res) => {
  try {
    const pendingFees = await Fee.find({ status: "pending" })
      .populate("student", "firstName lastName monthlyFee feeDuration phone parentName parentPhone")
      .sort({ date: -1 });

    res.json({
      count: pendingFees.length,
      totalAmount: pendingFees.reduce((sum, fee) => sum + fee.amount, 0),
      fees: pendingFees,
    });
  } catch (err) {
    console.error("Pending Fees Error:", err);
    res.status(500).json({ message: "Error fetching pending fees", error: err.message });
  }
};

// Get collected fees
exports.getCollectedFees = async (req, res) => {
  try {
    const collectedFees = await Fee.find({ status: "collected" })
      .populate("student", "firstName lastName")
      .populate("collectedBy", "username")
      .sort({ collectedAt: -1 });

    // Get coach names for collectedBy
    const Coach = require("../models/Coach");
    const feesWithCoachNames = await Promise.all(
      collectedFees.map(async (fee) => {
        if (fee.collectedBy) {
          const userId = fee.collectedBy._id || fee.collectedBy;
          const coach = await Coach.findOne({ user: userId });
          const coachName = coach?.name || fee.collectedBy?.username || "-";
          return {
            ...fee.toObject(),
            collectedBy: {
              ...fee.collectedBy?.toObject(),
              name: coachName,
              username: fee.collectedBy?.username || coachName
            }
          };
        }
        return fee.toObject();
      })
    );

    res.json({
      count: collectedFees.length,
      totalAmount: collectedFees.reduce((sum, fee) => sum + fee.amount, 0),
      fees: feesWithCoachNames,
    });
  } catch (err) {
    console.error("Collected Fees Error:", err);
    res.status(500).json({ message: "Error fetching collected fees", error: err.message });
  }
};

// Mark fee as collected (by month)
exports.markFeeCollected = async (req, res) => {
  try {
    const { feeId } = req.params; // Get feeId from route params
    const { month, mode } = req.body;

    if (!month) {
      return res.status(400).json({ message: "month is required" });
    }

    const fee = await Fee.findByIdAndUpdate(
      feeId,
      {
        status: "collected",
        month,
        mode: mode || "cash",
        collectedBy: req.user._id,
        collectedAt: new Date(),
      },
      { new: true }
    )
      .populate("student", "firstName lastName")
      .populate("collectedBy", "username");

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    // Calculate next due date
    const nextDueDate = new Date(fee.collectedAt || fee.date);
    const months = fee.feeForMonths === '1m' ? 1 : fee.feeForMonths === '3m' ? 3 : fee.feeForMonths === '6m' ? 6 : 12;
    nextDueDate.setMonth(nextDueDate.getMonth() + months);

    // Auto-create pending fee for next month if student has monthlyFee set
    const student = await Student.findById(fee.student);
    if (student && student.monthlyFee > 0) {
      const nextMonth = new Date(month + '-01');
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().slice(0, 7);
      
      // Check if fee already exists for next month
      const existingFee = await Fee.findOne({
        student: fee.student,
        month: nextMonthStr,
      });
      
      if (!existingFee) {
        await Fee.create({
          student: fee.student,
          amount: student.monthlyFee,
          feeForMonths: student.feeDuration || "1m",
          date: new Date(),
          month: nextMonthStr,
          status: "pending",
        });
      }
    }

    res.json({
      message: "Fee marked as collected successfully",
      fee,
      nextDueDate: nextDueDate.toISOString().slice(0, 10),
    });
  } catch (err) {
    console.error("Mark Fee Collected Error:", err);
    res.status(500).json({ message: "Error marking fee as collected", error: err.message });
  }
};

// ---------- ATTENDANCE REPORT ----------
exports.getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, studentId, status } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (studentId) query.student = studentId;
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate("student", "firstName lastName batch")
      .populate("coach", "username")
      .sort({ date: -1 });
    
    // Get coach names
    const Coach = require("../models/Coach");
    const attendanceWithCoachNames = await Promise.all(
      attendance.map(async (record) => {
        if (record.coach) {
          const userId = record.coach._id || record.coach;
          const coach = await Coach.findOne({ user: userId });
          const coachName = coach?.name || record.coach?.username || "-";
          return {
            ...record.toObject(),
            coach: {
              ...record.coach?.toObject(),
              name: coachName,
              username: record.coach?.username || coachName
            }
          };
        }
        return record.toObject();
      })
    );

    // Calculate summary
    const summary = await Attendance.aggregate([
      ...(Object.keys(query).length > 0 ? [{ $match: query }] : []),
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const present = summary.find((s) => s._id === "present")?.count || 0;
    const absent = summary.find((s) => s._id === "absent")?.count || 0;
    const leave = summary.find((s) => s._id === "leave")?.count || 0;

    res.json({
      attendance: attendanceWithCoachNames,
      summary: {
        total: attendance.length,
        present,
        absent,
        leave,
      },
    });
  } catch (err) {
    console.error("Attendance Report Error:", err);
    res.status(500).json({ message: "Error generating attendance report", error: err.message });
  }
};

// Overall report (for backward compatibility)
exports.overallReport = async (req, res) => {
  try {
    // Call getDashboardStats logic directly
    const totalStudents = await Student.countDocuments();
    const totalCoaches = await Coach.countDocuments();

    // Calculate total fees collection
    const feesStats = await Fee.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const collectedFees = feesStats.find((s) => s._id === "collected")?.totalAmount || 0;
    const pendingFees = feesStats.find((s) => s._id === "pending")?.totalAmount || 0;
    const totalFeesCollection = collectedFees;

    res.json({
      totalStudents,
      totalCoaches,
      totalFeesCollection,
      collectedFees,
      pendingFees,
    });
  } catch (err) {
    console.error("Overall Report Error:", err);
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
};

// Create fee manually
exports.createFee = async (req, res) => {
  try {
    const { studentId, amount, feeForMonths, month, status } = req.body;
    
    if (!studentId || !amount || !month) {
      return res.status(400).json({ message: "studentId, amount, and month are required" });
    }
    
    const fee = await Fee.create({
      student: studentId,
      amount: parseFloat(amount),
      feeForMonths: feeForMonths || "1m",
      date: new Date(),
      month,
      status: status || "pending",
    });
    
    const populatedFee = await Fee.findById(fee._id)
      .populate("student", "firstName lastName monthlyFee");
    
    res.json({
      message: "Fee created successfully",
      fee: populatedFee,
    });
  } catch (err) {
    console.error("Create Fee Error:", err);
    res.status(500).json({ message: "Error creating fee", error: err.message });
  }
};

// ---------- PROFILE MANAGEMENT ----------
// Get srcoach profile (we'll use User model, as srcoach doesn't have a separate profile model)
exports.getProfile = async (req, res) => {
  try {
    // SrCoach uses User model directly, so we return user info
    const user = await User.findById(req.user._id);
    res.json({
      username: user.username,
      role: user.role,
      profilePhotoUrl: user.profilePhotoUrl ? `http://localhost:5000${user.profilePhotoUrl}` : null,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// Update srcoach profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["username"];
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl ? `http://localhost:5000${user.profilePhotoUrl}` : null,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// Upload profile photo for srcoach
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePhotoUrl = `/uploads/profile-photos/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhotoUrl },
      { new: true }
    );

    res.json({
      message: "Profile photo uploaded successfully",
      user: {
        username: user.username,
        role: user.role,
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
