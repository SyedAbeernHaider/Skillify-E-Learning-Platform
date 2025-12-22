const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Certificate title is required'],
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    certificateNumber: {
        type: String,
        unique: true,
        required: true,
    },
    issueDate: {
        type: Date,
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'pending_instructor', 'pending_admin', 'approved', 'rejected'],
        default: 'pending_instructor',
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who approved
    },
    approvalDate: {
        type: Date,
    },
    certificateUrl: {
        type: String, // URL to generated certificate PDF
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass'],
    },
    completionPercentage: {
        type: Number,
        default: 100,
    },
}, {
    timestamps: true,
});

// Generate unique certificate number
certificateSchema.pre('save', async function () {
    if (!this.certificateNumber) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        this.certificateNumber = `SKILL-${timestamp}-${random}`;
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);
