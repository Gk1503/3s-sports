const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Coach = require("../models/Coach");
const User = require("../models/User");

// Get all students (coach can view all students)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "username")
      .select("-attendanceRecords") // Don't populate attendanceRecords to avoid large payload
      .sort({ firstName: 1 });

    res.json({
      count: students.length,
      students,
    });
  } catch (err) {
    console.error("Get All Students Error:", err);
    res.status(500).json({
      message: "Error fetching students",
      error: err.message,
    });
  }
};

// Get assigned students (if any)
exports.getAssignedStudents = async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id }).populate(
      "assignedStudents",
      "firstName lastName email phone batch monthlyFee feeDuration"
    );

    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.json({
      count: coach.assignedStudents.length,
      students: coach.assignedStudents,
    });
  } catch (err) {
    console.error("Get Assigned Students Error:", err);
    res.status(500).json({
      message: "Error fetching assigned students",
      error: err.message,
    });
  }
};

// Mark attendance with specific date
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, note } = req.body;

    if (!studentId || !date) {
      return res.status(400).json({
        message: "studentId and date are required",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Set time to start of day for consistent date comparison
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: {
        $gte: new Date(attendanceDate),
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    let attendance;

    if (existingAttendance) {
      // Update existing attendance
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          status: status || "present",
          note,
          coach: req.user._id,
        },
        { new: true }
      );
    } else {
      // Create new attendance
      attendance = await Attendance.create({
        student: studentId,
        date: attendanceDate,
        status: status || "present",
        note,
        coach: req.user._id,
      });

      // Add to student's attendanceRecords array
      await Student.findByIdAndUpdate(studentId, {
        $addToSet: { attendanceRecords: attendance._id },
      });
    }

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate("student", "firstName lastName")
      .populate("coach", "username");

    res.json({
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (err) {
    console.error("Mark Attendance Error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    res.status(500).json({
      message: "Error marking attendance",
      error: err.message,
    });
  }
};

// Mark multiple students attendance at once
exports.markBulkAttendance = async (req, res) => {
  try {
    const { students, date, status } = req.body; // students is array of studentIds

    if (!students || !Array.isArray(students) || students.length === 0 || !date) {
      return res.status(400).json({
        message: "students array and date are required",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];

    for (const studentId of students) {
      try {
        const existingAttendance = await Attendance.findOne({
          student: studentId,
          date: {
            $gte: new Date(attendanceDate),
            $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
          },
        });

        let attendance;

        if (existingAttendance) {
          attendance = await Attendance.findByIdAndUpdate(
            existingAttendance._id,
            {
              status: status || "present",
              coach: req.user._id,
            },
            { new: true }
          );
        } else {
          attendance = await Attendance.create({
            student: studentId,
            date: attendanceDate,
            status: status || "present",
            coach: req.user._id,
          });

          await Student.findByIdAndUpdate(studentId, {
            $addToSet: { attendanceRecords: attendance._id },
          });
        }

        results.push({ studentId, success: true, attendanceId: attendance._id });
      } catch (err) {
        results.push({ studentId, success: false, error: err.message });
      }
    }

    res.json({
      message: "Bulk attendance marked",
      results,
    });
  } catch (err) {
    console.error("Bulk Attendance Error:", err);
    res.status(500).json({
      message: "Error marking bulk attendance",
      error: err.message,
    });
  }
};

// Mark fee collection (cash received)
exports.markFeeCollection = async (req, res) => {
  try {
    const { studentId, amount, feeForMonths, month, mode, note } = req.body;

    if (!studentId || !amount || !month) {
      return res.status(400).json({
        message: "studentId, amount, and month are required",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if fee already exists for this month and student
    const existingFee = await Fee.findOne({
      student: studentId,
      month,
      status: "pending",
    });

    let fee;

    if (existingFee) {
      // Update existing fee
      fee = await Fee.findByIdAndUpdate(
        existingFee._id,
        {
          amount,
          feeForMonths: feeForMonths || "1m",
          status: "collected",
          mode: mode || "cash",
          note,
          collectedBy: req.user._id,
          collectedAt: new Date(),
        },
        { new: true }
      );
    } else {
      // Create new fee record
      fee = await Fee.create({
        student: studentId,
        amount,
        feeForMonths: feeForMonths || "1m",
        date: new Date(),
        month,
        status: "collected",
        mode: mode || "cash",
        note,
        collectedBy: req.user._id,
        collectedAt: new Date(),
      });
    }

    const populatedFee = await Fee.findById(fee._id)
      .populate("student", "firstName lastName monthlyFee")
      .populate("collectedBy", "username");

    // Calculate next due date
    const nextDueDate = new Date(fee.collectedAt || fee.date);
    const months = fee.feeForMonths === '1m' ? 1 : fee.feeForMonths === '3m' ? 3 : fee.feeForMonths === '6m' ? 6 : 12;
    nextDueDate.setMonth(nextDueDate.getMonth() + months);

    res.json({
      message: "Fee collection marked successfully",
      fee: populatedFee,
      nextDueDate: nextDueDate.toISOString().slice(0, 10),
    });
  } catch (err) {
    console.error("Mark Fee Collection Error:", err);
    res.status(500).json({
      message: "Error marking fee collection",
      error: err.message,
    });
  }
};

// Get attendance records for a student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, status } = req.query;

    let query = { student: studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (status) query.status = status;

    const attendance = await Attendance.find(query)
      .populate("student", "firstName lastName")
      .populate("coach", "username")
      .sort({ date: -1 });

    res.json({
      count: attendance.length,
      attendance,
    });
  } catch (err) {
    console.error("Get Student Attendance Error:", err);
    res.status(500).json({
      message: "Error fetching student attendance",
      error: err.message,
    });
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, status, studentId } = req.query;

    let query = {};
    if (date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      query.date = {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }
    if (status) query.status = status;
    if (studentId) query.student = studentId;

    const attendance = await Attendance.find(query)
      .populate("student", "firstName lastName batch")
      .populate("coach", "username")
      .sort({ date: -1 });

    res.json({
      count: attendance.length,
      attendance,
    });
  } catch (err) {
    console.error("Get All Attendance Error:", err);
    res.status(500).json({
      message: "Error fetching attendance",
      error: err.message,
    });
  }
};

// Get fee records
exports.getFeeRecords = async (req, res) => {
  try {
    const { studentId, status, month } = req.query;

    let query = {};
    if (studentId) query.student = studentId;
    if (status) query.status = status;
    if (month) query.month = month;

    const fees = await Fee.find(query)
      .populate("student", "firstName lastName monthlyFee")
      .populate("collectedBy", "username")
      .sort({ date: -1 });

    res.json({
      count: fees.length,
      totalAmount: fees.reduce((sum, fee) => sum + fee.amount, 0),
      fees,
    });
  } catch (err) {
    console.error("Get Fee Records Error:", err);
    res.status(500).json({
      message: "Error fetching fee records",
      error: err.message,
    });
  }
};

// Get coach profile
exports.getProfile = async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id })
      .populate("user", "username role")
      .populate("assignedStudents", "firstName lastName");

    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.json({
      ...coach.toObject(),
      username: coach.user.username,
      profilePhotoUrl: coach.profilePhotoUrl ? `http://localhost:5000${coach.profilePhotoUrl}` : null,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      message: "Error fetching profile",
      error: err.message,
    });
  }
};

// Update coach profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "phone", "email"];
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const coach = await Coach.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    )
      .populate("user", "username role");

    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      coach: {
        ...coach.toObject(),
        username: coach.user.username,
        profilePhotoUrl: coach.profilePhotoUrl ? `http://localhost:5000${coach.profilePhotoUrl}` : null,
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

    const coach = await Coach.findOneAndUpdate(
      { user: req.user._id },
      { profilePhotoUrl },
      { new: true, runValidators: true }
    )
      .populate("user", "username role");

    if (!coach) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    res.json({
      message: "Profile photo uploaded successfully",
      coach: {
        ...coach.toObject(),
        username: coach.user.username,
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
