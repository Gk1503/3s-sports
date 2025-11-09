const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  feeForMonths: { type: String, enum: ['1m', '3m', '6m', '12m'], default: '1m' }, // Fee duration (1 month, 3 months, etc.)
  date: { type: Date, required: true },
  month: { type: String }, // Format: "YYYY-MM" e.g., "2024-01"
  status: { type: String, enum: ['pending', 'collected'], default: 'pending' },
  mode: { type: String, enum: ['cash', 'online', 'cheque', 'other'], default: 'cash' },
  note: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // coach or srcoach
  collectedAt: { type: Date }, // When fee was collected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);
