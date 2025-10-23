// models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Link to the student's data
        required: true,
    },
    studentName: { // Storing name for easier reporting
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        // Unique index to prevent duplicate attendance for the same student on the same day
        unique: false, 
        index: true 
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
    },
    batch: {
        type: String, // Useful for filtering reports
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The coach who marked it
    },
}, { timestamps: true });

// Ensure combination of studentId and date is unique
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);