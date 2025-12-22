const QuizResult = require('../models/QuizResult');
const Badge = require('../models/Badge');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Submit quiz result
// @route   POST /api/student/quiz-results
// @access  Private (Student)
exports.submitQuizResult = async (req, res, next) => {
    try {
        const {
            courseId,
            sectionIndex,
            quizTitle,
            totalQuestions,
            correctAnswers,
            totalPoints,
            earnedPoints,
            percentage,
            passed,
            answers
        } = req.body;

        const studentId = req.user._id;

        // Get course and instructor info
        const course = await Course.findById(courseId).populate('instructor', 'firstName lastName email');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Create quiz result
        const quizResult = await QuizResult.create({
            student: studentId,
            studentName: `${req.user.firstName} ${req.user.lastName}`,
            studentEmail: req.user.email,
            course: courseId,
            courseName: course.title,
            instructor: course.instructor._id,
            instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
            sectionIndex,
            quizTitle,
            totalQuestions,
            correctAnswers,
            totalPoints,
            earnedPoints,
            percentage,
            passed,
            answers,
            submittedAt: new Date()
        });

        // --- UPDATE ENROLLMENT PROGRESS ---
        const Enrollment = require('../models/Enrollment');
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

        if (enrollment) {
            // Ensure progress object exists
            if (!enrollment.progress) {
                enrollment.progress = { completedQuizzes: [], completionPercentage: 0 };
            }
            if (!enrollment.progress.completedQuizzes) {
                enrollment.progress.completedQuizzes = [];
            }

            // Only update progress if quiz is PASSED
            if (passed) {
                const existingQuizIndex = enrollment.progress.completedQuizzes.findIndex(
                    q => q.sectionIndex === parseInt(sectionIndex)
                );

                if (existingQuizIndex >= 0) {
                    // Update existing
                    enrollment.progress.completedQuizzes[existingQuizIndex] = {
                        sectionIndex: parseInt(sectionIndex),
                        score: earnedPoints,
                        percentage: parseFloat(percentage),
                        completedAt: new Date()
                    };
                } else {
                    // Add new
                    enrollment.progress.completedQuizzes.push({
                        sectionIndex: parseInt(sectionIndex),
                        score: earnedPoints,
                        percentage: parseFloat(percentage),
                        completedAt: new Date()
                    });
                }

                // Calculate Progress Percentage
                // Count sections that HAVE quizzes
                const totalQuizzes = course.sections.filter(s => s.quiz && s.quiz.questions && s.quiz.questions.length > 0).length;
                const completedQuizzesCount = enrollment.progress.completedQuizzes.length;

                const progressPercentage = totalQuizzes > 0
                    ? Math.min(100, Math.round((completedQuizzesCount / totalQuizzes) * 100))
                    : 0;

                enrollment.progress.completionPercentage = progressPercentage;

                // Check if course is completed
                if (progressPercentage >= 100) {
                    enrollment.isCompleted = true;
                    enrollment.completedAt = new Date();
                }

                await enrollment.save();
            }
        }

        res.status(201).json({
            success: true,
            message: 'Quiz result submitted successfully',
            data: quizResult
        });
    } catch (error) {
        console.error('Submit quiz result error:', error);
        next(error);
    }
};

// @desc    Get student's quiz results
// @route   GET /api/student/quiz-results/:courseId
// @access  Private (Student)
exports.getStudentQuizResults = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        const results = await QuizResult.find({
            student: studentId,
            course: courseId
        }).sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
