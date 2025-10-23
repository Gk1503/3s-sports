import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import User from "../models/User.js";
import Student from "../models/Student.js";
import Coach from "../models/Coach.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Ensure uploads directory exists (use root-level 'uploads' for reliability)
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `user-${req.params.id || req.user?._id}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({ storage });

// -----------------------------------------------------------------------------
// ✅ Sr Coach adds a new student (simple version)
router.post("/students", protect, authorize(["srCoach"]), async (req, res) => {
  const { username, password, name, contact, ageCategory, batch, fees } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await User.create({
      username,
      password,
      role: "student",
      name,
    });

    const newStudent = await Student.create({
      userId: newUser._id,
      contact,
      ageCategory,
      batch,
      fees: { total: fees, paid: 0, due: fees },
      feeStatus: fees > 0 ? "Pending" : "Paid",
    });

    res.status(201).json({
      message: "Student added successfully",
      user: newUser,
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error while adding student" });
  }
});

// -----------------------------------------------------------------------------
// ✅ Sr Coach updates a student or their own profile (with image upload)
router.put(
  "/update-profile/:id",
  protect,
  authorize(["srCoach", "student" , "coach"]),
  upload.single("profileImage"),
  async (req, res) => {
    const userIdToUpdate = req.params.id;

    // Students can only update their own profile
    if (req.user.role === "student" && req.user._id.toString() !== userIdToUpdate) {
      return res
        .status(403)
        .json({ message: "Forbidden: Cannot update another user's profile" });
    }

    try {
      const user = await User.findById(userIdToUpdate);
      if (!user) return res.status(404).json({ message: "User not found" });

      // ✅ Update name if provided
      if (req.body.name) {
        user.name = req.body.name;
        await user.save();
      }

      // ✅ Handle profile photo upload
      const photoPath = req.file
        ? `/uploads/${req.file.filename}`
        : user.photo || "";

      let relatedProfile = null;

      if (user.role === "student") {
        relatedProfile = await Student.findOne({ userId: user._id });
        if (relatedProfile) {
          if (photoPath) relatedProfile.photo = photoPath;
          await relatedProfile.save();
        }
      } else if (user.role === "coach" || user.role === "srCoach") {
        relatedProfile = await Coach.findOne({ userId: user._id });
        if (relatedProfile) {
          if (photoPath) relatedProfile.photo = photoPath;
          await relatedProfile.save();
        }
      }

      res.json({
        message: "Profile updated successfully",
        name: user.name,
        role: user.role,
        photo: relatedProfile ? relatedProfile.photo : photoPath,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error during profile update" });
    }
  }
);

// -----------------------------------------------------------------------------
// ✅ Alternate detailed student registration route
router.post("/add-student", protect, authorize(["srCoach" ,"coach" ]), async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      contact,
      address,
      school,
      ageCategory,
      batch,
      timings,
      fees,
      status,
    } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    const newUser = new User({
      name,
      username,
      password,
      role: "student",
    });
    await newUser.save();

    const newStudent = new Student({
      userId: newUser._id,
      contact,
      address,
      school,
      ageCategory,
      batch,
      batchTime: timings,
      fees: {
        total: fees,
        paid: status === "Paid" ? fees : 0,
        due: status === "Paid" ? 0 : fees,
      },
      feeStatus: status,
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error while adding student" });
  }
});
// Get all students (with user info)
router.get("/students", protect, authorize(["srCoach", "coach"]), async (req, res) => {
  try {
    // Populate the 'userId' field to get student name and username
    const students = await Student.find().populate("userId", "name username");
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

// --- In srCoachRoutes.js ---

// ... existing imports and code ...

// ✅ Update a student's data (PUT /api/srcoach/students/:id)
router.put("/students/:id", protect, authorize(["srCoach" , "coach"]), async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, username, password, status, fees, ...studentFields } = req.body;

    // 1. Find and update User details (only name, optional)
    const studentRecord = await Student.findById(studentId);
    if (!studentRecord) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Update User name if provided
    if (name) {
      await User.findByIdAndUpdate(studentRecord.userId, { name });
    }

    // 2. Prepare Student model updates
    const updateFields = { ...studentFields };

    // Recalculate fees and status
    if (fees !== undefined || status !== undefined) {
      const newTotalFees = fees !== undefined ? fees : studentRecord.fees.total;
      const newFeeStatus = status || studentRecord.feeStatus;
      
      updateFields.fees = {
        total: newTotalFees,
        paid: newFeeStatus === "Paid" ? newTotalFees : 0,
        due: newFeeStatus === "Paid" ? 0 : newTotalFees,
      };
      updateFields.feeStatus = newFeeStatus;
    }
    
    // 3. Update Student record
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateFields, {
      new: true, // return the updated document
    }).populate("userId", "name username"); // Re-populate for the front-end

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error while updating student" });
  }
});

// ✅ Delete a student and their user account (DELETE /api/srcoach/students/:id)
router.delete("/students/:id", protect, authorize(["srCoach"]), async (req, res) => {
  try {
    const studentId = req.params.id;

    const studentRecord = await Student.findById(studentId);
    if (!studentRecord) {
      return res.status(404).json({ message: "Student record not found" });
    }

    // Get the linked User ID
    const userId = studentRecord.userId;

    // 1. Delete the Student record
    await Student.deleteOne({ _id: studentId });

    // 2. Delete the associated User account
    await User.deleteOne({ _id: userId });

    res.json({ message: "Student and associated user deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error while deleting student" });
  }
});
router.post("/coaches", protect, authorize(["srCoach"]), async (req, res) => {
    const { name, username, password, specialization, contact } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // 1. Create the User account
        const newUser = await User.create({
            username,
            password,
            role: "coach", // Role is 'coach'
            name,
        });

        // 2. Create the Coach profile, linked to the new User
        const newCoach = await Coach.create({
            userId: newUser._id,
            specialization,
            contact,
        });

        // 3. Return the new coach object, populated with the user's name for the frontend
        const populatedCoach = await newCoach.populate("userId", "name username");

        res.status(201).json({
            message: "Coach added successfully",
            coach: populatedCoach,
        });
    } catch (error) {
        console.error("Error adding coach:", error);
        res.status(500).json({ message: "Server error while adding coach" });
    }
});

// =============================================================================
// 2. GET ALL COACHES (GET /api/srcoach/coaches)
// Fetches all coach profiles and populates them with User details.
router.get("/coaches", protect, authorize(["srCoach"]), async (req, res) => {
    try {
        // Populate the 'userId' field to get coach name and username
        const coaches = await Coach.find().populate("userId", "name username");
        res.json(coaches);
    } catch (error) {
        console.error("Error fetching coaches:", error);
        res.status(500).json({ message: "Error fetching coaches" });
    }
});

// =============================================================================
// 3. UPDATE COACH (PUT /api/srcoach/coaches/:id)
// Updates the linked User's name and the Coach's profile details.
router.put("/coaches/:id", protect, authorize(["srCoach"]), async (req, res) => {
    try {
        const coachId = req.params.id;
        const { name, specialization, contact } = req.body;

        // 1. Find the Coach record
        const coachRecord = await Coach.findById(coachId);
        if (!coachRecord) {
            return res.status(404).json({ message: "Coach record not found" });
        }

        // 2. Update User name if provided (User name is stored in the User model)
        if (name) {
            await User.findByIdAndUpdate(coachRecord.userId, { name });
        }

        // 3. Update Coach record fields
        const updateFields = { specialization, contact };

        const updatedCoach = await Coach.findByIdAndUpdate(coachId, updateFields, {
            new: true, // return the updated document
            runValidators: true,
        }).populate("userId", "name username"); // Re-populate for the front-end

        res.json({ message: "Coach updated successfully", coach: updatedCoach });
    } catch (error) {
        console.error("Error updating coach:", error);
        res.status(500).json({ message: "Server error while updating coach" });
    }
});

// =============================================================================
// 4. DELETE COACH (DELETE /api/srcoach/coaches/:id)
// Deletes both the Coach profile and the associated User account.
router.delete("/coaches/:id", protect, authorize(["srCoach"]), async (req, res) => {
    try {
        const coachId = req.params.id;

        const coachRecord = await Coach.findById(coachId);
        if (!coachRecord) {
            return res.status(404).json({ message: "Coach record not found" });
        }

        // Get the linked User ID
        const userId = coachRecord.userId;

        // 1. Delete the Coach record
        await Coach.deleteOne({ _id: coachId });

        // 2. Delete the associated User account
        await User.deleteOne({ _id: userId });

        res.json({ message: "Coach and associated user deleted successfully" });
    } catch (error) {
        console.error("Error deleting coach:", error);
        res.status(500).json({ message: "Server error while deleting coach" });
    }
});

router.get("/coach-students", protect, authorize(["srCoach", "coach"]), async (req, res) => {
    try {
        // NOTE: In a real app, you would filter students based on req.user._id if they are assigned.
        // For now, it returns all students, similar to the srCoach route.
        const students = await Student.find().populate("userId", "name username");
        res.json(students);
    } catch (error) {
        console.error("Error fetching students for coach:", error);
        res.status(500).json({ message: "Error fetching student list" });
    }
});

// ... existing imports ...
// ... existing routes ...

// =============================================================================
// 5. PROCESS FEE PAYMENT (POST /api/srcoach/students/:id/fee-payment)
// Allows SrCoach/Coach to record a payment for a student.
router.post("/students/:id/fee-payment", protect, authorize(["srCoach", "coach"]), async (req, res) => {
    try {
        const studentId = req.params.id;
        const { amount, date } = req.body; // 'date' is for logging/display if you expand the model later

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid payment amount." });
        }

        const studentRecord = await Student.findById(studentId);
        if (!studentRecord) {
            return res.status(404).json({ message: "Student record not found" });
        }

        let newPaid = studentRecord.fees.paid + amount;
        let newDue = studentRecord.fees.total - newPaid;
        let newStatus = newDue <= 0 ? "Paid" : "Pending";

        if (newPaid > studentRecord.fees.total) {
            newPaid = studentRecord.fees.total; // Prevent over-payment beyond total
            newDue = 0;
            newStatus = "Paid";
        }
        
        const updateFields = {
            feeStatus: newStatus,
            fees: {
                total: studentRecord.fees.total,
                paid: newPaid,
                due: newDue,
            },
            // Optionally, log the payment date and amount here if the model allowed it.
        };

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updateFields, {
            new: true,
            runValidators: true,
        }).populate("userId", "name username");

        res.json({ 
            message: `Payment of ₹${amount} recorded. New status: ${updatedStudent.feeStatus}`, 
            student: updatedStudent 
        });
    } catch (error) {
        console.error("Error processing fee payment:", error);
        res.status(500).json({ message: "Server error while processing fee payment" });
    }
});

// ... existing export default router;

export default router;
