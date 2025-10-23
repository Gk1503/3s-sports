import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, default: 'General' },
    contact: { type: String },
}, { timestamps: true });

export default mongoose.model('Coach', CoachSchema);
