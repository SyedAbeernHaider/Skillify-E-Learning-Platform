const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema({
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
    assignmentTitle: {
        type: String,
        required: true
    },
    submissionText: {
        type: String
    },
    submissionFile: {
        type: String // URL to uploaded file
    },
    fileName: {
        type: String
    },
    fileType: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['submitted', 'graded', 'returned'],
        default: 'submitted'
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: {
        type: String
    },
    gradedAt: {
        type: Date
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
assignmentSubmissionSchema.index({ student: 1, course: 1, lectureId: 1 });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
