const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
    },
    shortDescription: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    thumbnail: {
        type: String,
        default: '',
    },
    introVideo: {
        type: String,
        default: '',
    },
    previewVideo: {
        type: String,
        default: '',
    },
    // Course content structure
    sections: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        order: {
            type: Number,
            required: true,
        },
        lessons: [{
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            videoUrl: {
                type: String,
            },
            duration: {
                type: Number, // in minutes
            },
            content: {
                type: String, // HTML or markdown content
            },
            order: {
                type: Number,
                required: true,
            },
            resources: [{
                title: String,
                url: String,
                type: String, // pdf, doc, link, etc.
            }],
            // Assignment for this lecture
            assignment: {
                title: String,
                description: String,
                dueDate: Date,
                maxPoints: {
                    type: Number,
                    default: 100
                },
                submissionType: {
                    type: String,
                    enum: ['file', 'text', 'both'],
                    default: 'both'
                },
                isRequired: {
                    type: Boolean,
                    default: false
                }
            },
            // Quiz for this lecture
            quiz: {
                title: String,
                description: String,
                timeLimit: Number, // in minutes
                passingScore: {
                    type: Number,
                    default: 70
                },
                attemptsAllowed: {
                    type: Number,
                    default: 1
                },
                questions: [{
                    questionText: {
                        type: String,
                        required: true
                    },
                    options: [{
                        type: String,
                        required: true
                    }],
                    correctAnswer: {
                        type: Number, // index of correct option (0-3)
                        required: true
                    },
                    points: {
                        type: Number,
                        default: 1
                    },
                    explanation: String
                }]
            }
        }],
        // Quiz for this section
        quiz: {
            title: String,
            description: String,
            timeLimit: Number, // in minutes
            passingScore: {
                type: Number,
                default: 70
            },
            questions: [{
                questionText: {
                    type: String,
                    required: true
                },
                options: [{
                    type: String,
                    required: true
                }],
                correctAnswer: {
                    type: Number, // index of correct option (0-3)
                    required: true
                },
                points: {
                    type: Number,
                    default: 1
                },
                explanation: String
            }]
        }
    }],
    // Approval status
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    approvalDate: {
        type: Date,
    },
    rejectionReason: {
        type: String,
    },
    isFirstApproval: {
        type: Boolean,
        default: true,
    },
    // Statistics
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    totalEnrollments: {
        type: Number,
        default: 0,
    },
    totalViews: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: String,

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    // Course metadata
    language: {
        type: String,
        default: 'English',
    },
    duration: {
        type: Number, // total duration in minutes
        default: 0,
    },
    requirements: [{
        type: String,
    }],
    whatYouWillLearn: [{
        type: String,
    }],
    tags: [{
        type: String,
    }],
    // New fields for Final.txt requirements
    totalLectures: {
        type: Number,
        default: 0,
    },
    certificationAvailable: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['started', 'pending'],
        default: 'pending',
    },
    startDate: {
        type: Date,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isContentLocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Calculate total duration from all lessons
courseSchema.methods.calculateTotalDuration = function () {
    let total = 0;
    this.sections.forEach(section => {
        section.lessons.forEach(lesson => {
            total += lesson.duration || 0;
        });
    });
    this.duration = total;
    return total;
};

// Calculate average rating
courseSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        return 0;
    }

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = sum / this.reviews.length;
    return this.rating;
};

module.exports = mongoose.model('Course', courseSchema);
