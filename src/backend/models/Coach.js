const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  email: String,
  profilePhotoUrl: String,
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coach', coachSchema);
