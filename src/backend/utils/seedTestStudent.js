const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");

const seedTestStudent = async () => {
  try {
    const existingStudent = await Student.findOne({ firstName: "Test" }).populate("user");
    if (existingStudent) {
      console.log("✅ Test Student already exists:", existingStudent.user.username);
      return;
    }

    // Create User
    const passwordPlain = "student123";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);

    const user = await User.create({
      username: "teststudent",
      passwordHash,
      role: "student",
      temporaryPassword: passwordPlain, // Store plain password for display
    });

    // Create Student
    const student = await Student.create({
      user: user._id,
      firstName: "Test",
      lastName: "Student",
      email: "student@3ssports.com",
      phone: "9876543210",
      gender: "Male",
      batch: "2024",
      address: "Test Address",
      parentName: "Parent Name",
      parentPhone: "9999999999",
      monthlyFee: 5000,
      feeDuration: "1m",
      skills: {
        role: "batsman",
        battingHand: "right",
        bowlingHand: "right",
      },
      registrationSource: "srcoach",
    });

    console.log("🌟 Test Student account created — username: teststudent | password: student123");
  } catch (error) {
    console.error("❌ Error seeding Test Student:", error.message);
  }
};

module.exports = seedTestStudent;
