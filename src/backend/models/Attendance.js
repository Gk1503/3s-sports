const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who marked
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' },
  note: String,
  createdAt: { type: Date, default: Date.now }
});

// Ensure one record per day per student
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
