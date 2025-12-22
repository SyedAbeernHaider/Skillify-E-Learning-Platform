const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Assignment description is required'],
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
    dueDate: {
        type: Date,
        required: true,
    },
    totalPoints: {
        type: Number,
        default: 100,
    },
    attachments: [{
        title: String,
        url: String,
        type: String,
    }],
    instructions: {
        type: String,
    },
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        files: [{
            title: String,
            url: String,
        }],
        text: {
            type: String,
        },
        grade: {
            type: Number,
            min: 0,
        },
        feedback: {
            type: String,
        },
        status: {
            type: String,
            enum: ['submitted', 'graded', 'late'],
            default: 'submitted',
        },
        gradedAt: {
            type: Date,
        },
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
