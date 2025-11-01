const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  mode: { type: String, enum: ['cash', 'online', 'cheque', 'other'], default: 'cash' },
  note: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // coach or srcoach
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);
