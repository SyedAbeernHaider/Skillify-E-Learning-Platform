const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    progress: {
        completedLessons: [{
            sectionIndex: Number,
            lessonIndex: Number,
            completedAt: Date,
        }],
        completedQuizzes: [{
            sectionIndex: Number,
            score: Number,
            percentage: Number,
            completedAt: Date,
        }],
        currentSection: {
            type: Number,
            default: 0,
        },
        currentLesson: {
            type: Number,
            default: 0,
        },
        completionPercentage: {
            type: Number,
            default: 0,
        },
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'free'],
        default: 'free',
    },
    amountPaid: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Calculate completion percentage
enrollmentSchema.methods.calculateProgress = function (totalLessons) {
    const completedCount = this.progress.completedLessons.length;
    this.progress.completionPercentage = totalLessons > 0
        ? (completedCount / totalLessons) * 100
        : 0;
    return this.progress.completionPercentage;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
