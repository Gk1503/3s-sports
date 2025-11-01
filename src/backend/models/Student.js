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
  monthlyFee: { type: Number, default: 0 }, // Monthly fee amount set by srcoach
  feeDuration: { type: String, enum: ['1m', '3m', '6m', '12m'], default: '1m' }, // Fee duration
  attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
