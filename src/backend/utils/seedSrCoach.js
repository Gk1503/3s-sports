const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedSeniorCoach = async () => {
  try {
    const existing = await User.findOne({ role: "seniorCoach" });
    if (existing) {
      console.log("✅ Senior Coach already exists:", existing.username);
      return;
    }

    const passwordHash = await bcrypt.hash("headcoach123", 10);

    const newCoach = new User({
      username: "headcoach",
      passwordHash,
      role: "seniorCoach",
    });

    await newCoach.save();
    console.log("🌟 Senior Coach account created — username: headcoach | password: headcoach123");
  } catch (error) {
    console.error("❌ Error seeding Senior Coach:", error.message);
  }
};

module.exports = seedSeniorCoach;
