const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to auth user
  firstName: { type: String, required: true },
  lastName: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  address: String,
  profilePhotoUrl: String,
  batch: String,
  parentName: String,
  parentPhone: String,
  extraInfo: String,
  // Skills: role, battingHand, bowlingHand, bowlingType, wicketKeeper
  skills: {
    role: { type: String, enum: ['batsman', 'bowler', 'all-rounder'] },
    battingHand: { type: String, enum: ['right', 'left'] },
    bowlingHand: { type: String, enum: ['right', 'left'] },
    bowlingType: { type: String, enum: ['fast', 'medium-fast', 'spinner'] },
    wicketKeeper: { type: Boolean, default: false },
    // Legacy support
    handedness: { type: String, enum: ['right', 'left'] },
    tags: [{ type: String }],
  },
  monthlyFee: { type: Number, default: 0 },
  feeDuration: { type: String, enum: ['1m', '3m', '6m', '12m'], default: '1m' },
  attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  registrationSource: { type: String, enum: ['srcoach', 'self'], default: 'srcoach' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
