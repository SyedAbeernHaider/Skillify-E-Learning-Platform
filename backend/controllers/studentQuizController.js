const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// @desc    Get quizzes for a course
// @route   GET /api/student/quizzes/course/:courseId
// @access  Private (Student)
exports.getCourseQuizzes = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const quizzes = await Quiz.find({ course: courseId, isActive: true })
            .select('-__v')
            .sort({ sectionIndex: 1 });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz by section
// @route   GET /api/student/quizzes/course/:courseId/section/:sectionIndex
// @access  Private (Student)
exports.getQuizBySection = async (req, res, next) => {
    try {
        const { courseId, sectionIndex } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const section = course.sections[parseInt(sectionIndex)];
        if (!section || !section.quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // Return quiz data (hide correct answers if necessary, but frontend usually needs options)
        // Ensure options are there
        const quiz = section.quiz;

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
