import mongoose from 'mongoose';


const AttendanceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' },
});

const ProgressSchema = new mongoose.Schema({
    batting: { type: Number, default: 0 },
    bowling: { type: Number, default: 0 },
    diet: { type: Number, default: 0 },
    fitness: { type: Number, default: 0 },
    // Add other progress fields as needed
});

const FeesSchema = new mongoose.Schema({
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    due: { type: Number, default: 0 },
});

const StudentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Link to the User model
    batch: { type: String, default: 'Unassigned' },
    batchTime: { type: String, default: 'N/A' },
    photo: { type: String, default: 'https://via.placeholder.com/150' }, // URL to profile photo
    attendance: [AttendanceSchema],
    progress: { type: ProgressSchema, default: {} },
   fees: { 
        total: { type: Number, default: 0 },
    },
    // Fields from SrCoachDashboard for management
    contact: { type: String },
    address: { type: String },
    school: { type: String },
    ageCategory: { type: String },
    feePayments: [ 
        {
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
            recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: track who recorded it
        }
    ],
    // fees status is derived from the 'fees' subdocument but can be stored for quick access
    feeStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Student', StudentSchema);