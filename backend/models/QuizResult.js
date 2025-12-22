const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    sectionIndex: {
        type: Number,
        required: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    earnedPoints: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    answers: {
        type: Map,
        of: Number
    },
    badgeAwarded: {
        type: Boolean,
        default: false
    },
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
quizResultSchema.index({ student: 1, course: 1 });
quizResultSchema.index({ instructor: 1, course: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
