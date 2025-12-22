const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Badge name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // URL or icon name
        default: '',
    },
    color: {
        type: String,
        default: '#FFD700', // Gold color
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    reason: {
        type: String, // Why the badge was awarded
    },
    awardedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Badge', badgeSchema);
