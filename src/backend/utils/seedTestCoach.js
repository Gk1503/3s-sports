const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Coach = require("../models/Coach");

const seedTestCoach = async () => {
  try {
    const existingUser = await User.findOne({ username: "coach" });
    if (existingUser) {
      console.log("✅ Test Coach already exists:", existingUser.username);
      return;
    }

    const passwordHash = await bcrypt.hash("coach123", 10);

    // Create User
    const user = new User({
      username: "coach",
      passwordHash,
      role: "coach",
    });
    await user.save();

    // Create Coach Profile
    const coach = new Coach({
      user: user._id,
      name: "Test Coach",
      phone: "9876543210",
      email: "coach@test.com",
    });
    await coach.save();

    console.log("🌟 Test Coach account created — username: coach | password: coach123");
  } catch (error) {
    console.error("❌ Error seeding Test Coach:", error.message);
  }
};

module.exports = seedTestCoach;
