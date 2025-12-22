const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
    },
    description: {
        type: String,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    sectionIndex: {
        type: Number,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeLimit: {
        type: Number, // in minutes
        default: 30,
    },
    passingScore: {
        type: Number,
        default: 70, // percentage
    },
    questions: [{
        questionText: {
            type: String,
            required: true,
        },
        options: [{
            type: String,
            required: true,
        }],
        correctAnswer: {
            type: Number, // index of correct option (0-3)
            required: true,
        },
        points: {
            type: Number,
            default: 1,
        },
        explanation: {
            type: String,
        },
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
quizSchema.index({ course: 1, sectionIndex: 1 });
quizSchema.index({ instructor: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
