const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// @desc    Create quiz for a section
// @route   POST /api/instructor/quizzes
// @access  Private (Instructor)
exports.createQuiz = async (req, res, next) => {
    try {
        const { courseId, sectionIndex, title, description, timeLimit, passingScore, questions } = req.body;

        // Verify course exists and instructor owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create quiz for this course'
            });
        }

        // Check if quiz already exists for this section
        const existingQuiz = await Quiz.findOne({ course: courseId, sectionIndex });
        if (existingQuiz) {
            return res.status(400).json({
                success: false,
                message: 'Quiz already exists for this section. Please update it instead.'
            });
        }

        // Create quiz
        const quiz = await Quiz.create({
            title,
            description,
            course: courseId,
            sectionIndex,
            instructor: req.user._id,
            timeLimit,
            passingScore,
            questions
        });

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update quiz
// @route   PUT /api/instructor/quizzes/:id
// @access  Private (Instructor)
exports.updateQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Verify instructor owns this quiz
        if (quiz.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this quiz'
            });
        }

        // Update quiz
        const { title, description, timeLimit, passingScore, questions } = req.body;
        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.timeLimit = timeLimit || quiz.timeLimit;
        quiz.passingScore = passingScore || quiz.passingScore;
        quiz.questions = questions || quiz.questions;

        await quiz.save();

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete quiz
// @route   DELETE /api/instructor/quizzes/:id
// @access  Private (Instructor)
exports.deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Verify instructor owns this quiz
        if (quiz.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this quiz'
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quizzes for a course
// @route   GET /api/instructor/quizzes/course/:courseId
// @access  Private (Instructor)
exports.getCourseQuizzes = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Verify course exists and instructor owns it
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view quizzes for this course'
            });
        }

        const quizzes = await Quiz.find({ course: courseId }).sort({ sectionIndex: 1 });

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
// @route   GET /api/instructor/quizzes/course/:courseId/section/:sectionIndex
// @access  Private (Instructor)
exports.getQuizBySection = async (req, res, next) => {
    try {
        const { courseId, sectionIndex } = req.params;

        const quiz = await Quiz.findOne({ course: courseId, sectionIndex: parseInt(sectionIndex) });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'No quiz found for this section'
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
