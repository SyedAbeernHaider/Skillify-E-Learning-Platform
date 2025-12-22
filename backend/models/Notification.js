const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: [
            'instructor_application_approved',
            'instructor_application_rejected',
            'course_approved',
            'course_rejected',
            'new_enrollment',
            'assignment_submitted',
            'assignment_graded',
            'quiz_completed',
            'badge_awarded',
            'certificate_approved',
            'certificate_rejected',
            'new_message',
            'general',
            'system_notification',
        ],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String, // URL to navigate to when clicked
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // Additional data related to notification
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
