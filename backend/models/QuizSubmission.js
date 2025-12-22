const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: String,
        selectedAnswer: Number, // index of selected option
        correctAnswer: Number, // index of correct option
        isCorrect: Boolean,
        points: Number
    }],
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    score: {
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
    timeTaken: {
        type: Number, // in seconds
        required: true
    },
    attemptNumber: {
        type: Number,
        default: 1
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
quizSubmissionSchema.index({ student: 1, course: 1, lectureId: 1 });

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);
