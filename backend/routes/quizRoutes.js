const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Instructor routes
router.post(
    '/instructor/courses/:courseId/lectures/:lectureId/quiz',
    protect,
    authorize('instructor'),
    quizController.createQuiz
);

router.put(
    '/instructor/courses/:courseId/lectures/:lectureId/quiz',
    protect,
    authorize('instructor'),
    quizController.updateQuiz
);

router.get(
    '/instructor/courses/:courseId/lectures/:lectureId/quiz/results',
    protect,
    authorize('instructor'),
    quizController.getQuizResultsForLecture
);

// Student routes
router.get(
    '/student/courses/:courseId/lectures/:lectureId/quiz',
    protect,
    authorize('student'),
    quizController.getQuiz
);

router.post(
    '/student/courses/:courseId/lectures/:lectureId/quiz/submit',
    protect,
    authorize('student'),
    quizController.submitQuiz
);

router.get(
    '/student/quiz-submissions/:submissionId',
    protect,
    quizController.getQuizResults
);

module.exports = router;
