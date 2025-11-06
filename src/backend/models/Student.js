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
  // Skills: primaryRole, handedness, wicketKeeper boolean, and tags for multiple skills
  skills: {
    role: { type: String, enum: ['batsman', 'bowler', 'all-rounder'], default: 'batsman' },
    handedness: { type: String, enum: ['right', 'left'], default: 'right' },
    wicketKeeper: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  monthlyFee: { type: Number, default: 0 },
  feeDuration: { type: String, enum: ['1m', '3m', '6m', '12m'], default: '1m' },
  attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  registrationSource: { type: String, enum: ['srcoach', 'self'], default: 'srcoach' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
