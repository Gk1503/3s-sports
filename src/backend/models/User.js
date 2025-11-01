const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'coach', 'seniorCoach'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who created this user (srcoach)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
