const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { isStudent } = require('../middleware/roleMiddleware');

// Public routes (courses browsing)
router.get('/courses', studentController.getAllCourses);
router.get('/courses/:id', studentController.getCourseDetails);

// Protected student routes
router.use(protect);

// Dashboard
router.get('/dashboard', studentController.getDashboardStats);

// Enrollments
router.post('/courses/:id/enroll', studentController.enrollInCourse);
router.get('/enrollments', studentController.getEnrolledCourses);
router.put('/enrollments/:id/progress', studentController.updateProgress);

// Assignments
router.post('/assignments/:id/submit', studentController.submitAssignment);

// Quizzes
router.post('/quizzes/:id/attempt', studentController.takeQuiz);
router.post('/courses/:courseId/sections/:sectionIndex/quiz/attempt', (req, res, next) => {
    console.log('🎯 ROUTE HIT: /courses/:courseId/sections/:sectionIndex/quiz/attempt');
    console.log('Method:', req.method);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    next();
}, studentController.submitEmbeddedQuiz);

// Quiz Results
const quizResultController = require('../controllers/quizResultController');
router.post('/quiz-results', quizResultController.submitQuizResult);
router.get('/quiz-results/:courseId', studentController.getStudentQuizResults);

// Quizzes (separate collection)
const studentQuizController = require('../controllers/studentQuizController');
router.get('/quizzes/course/:courseId', studentQuizController.getCourseQuizzes);
router.get('/quizzes/course/:courseId/section/:sectionIndex', studentQuizController.getQuizBySection);

// Badges
router.get('/badges', studentController.getBadges);
router.get('/badges/:courseId', studentController.getCourseBadges);

// Certificates
router.get('/certificates', studentController.getCertificates);
router.post('/certificates/request', studentController.requestCertificate);
router.get('/courses/:courseId/certificate-eligibility', studentController.getCertificateEligibility);

module.exports = router;
