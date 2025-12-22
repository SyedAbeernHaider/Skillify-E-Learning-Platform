const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    education: {
        type: String,
        required: [true, 'Education is required'],
        trim: true,
    },
    experience: {
        type: String,
        required: [true, 'Experience is required'],
        trim: true,
    },
    expertise: [{
        type: String,
        trim: true,
    }],
    certificateUrls: [{
        type: String,
        trim: true,
    }],
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: {
        type: Date,
    },
    rejectionReason: {
        type: String,
    },
}, {
    timestamps: true,
});

// Validation: Max 5 expertise keywords
instructorProfileSchema.pre('save', async function () {
    if (this.expertise && this.expertise.length > 5) {
        throw new Error('Maximum 5 expertise keywords allowed');
    }
});

module.exports = mongoose.model('InstructorProfile', instructorProfileSchema);
