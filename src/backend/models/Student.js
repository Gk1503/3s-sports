const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link to auth user
  firstName: String,
  lastName: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  address: String,
  profilePhotoUrl: String,
  batch: String,
  parentName: String,
  extraInfo: String,
  fees: [{ type: Number, default: 0 }],
  attendanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
