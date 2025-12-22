const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
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
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    enrollment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    platformFee: {
        type: Number,
        // Not required - will be calculated in pre-save hook
    },
    instructorAmount: {
        type: Number,
        // Not required - will be calculated in pre-save hook
    },
    platformFeePercentage: {
        type: Number,
        default: 10, // 10% platform fee
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        default: 'online',
    },
    transactionId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'refunded'],
        default: 'completed',
    },
}, {
    timestamps: true,
});

// Calculate platform fee and instructor amount before saving
revenueSchema.pre('save', async function () {
    // Calculate if not already set
    if (!this.platformFee) {
        this.platformFee = (this.totalAmount * this.platformFeePercentage) / 100;
    }
    if (!this.instructorAmount) {
        this.instructorAmount = this.totalAmount - this.platformFee;
    }
});

module.exports = mongoose.model('Revenue', revenueSchema);
