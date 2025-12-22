const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const instructorProfileController = require('../controllers/instructorProfileController');
const { protect } = require('../middleware/authMiddleware');
const { isInstructor, isApprovedInstructor } = require('../middleware/roleMiddleware');

// Profile routes (require instructor role but not approval)
router.post('/profile/submit', protect, isInstructor, instructorProfileController.submitProfile);
router.get('/profile', protect, isInstructor, instructorProfileController.getProfile);
router.put('/profile', protect, isInstructor, instructorProfileController.updateProfile);
router.get('/profile/status', protect, isInstructor, instructorProfileController.getProfileStatus);

// All routes below require both authentication AND approved instructor status
router.use(protect);
router.use(isApprovedInstructor);

// Dashboard
router.get('/dashboard', instructorController.getDashboardStats);

// Courses
router.get('/courses', instructorController.getCourses);
router.get('/courses/:id', instructorController.getSingleCourse);
router.post('/courses', instructorController.createCourse);
router.put('/courses/:id', instructorController.updateCourse);
router.get('/courses/:id/enrollments', instructorController.getCourseEnrollments);
router.get('/courses/:id/overview', instructorController.getCourseOverview);
router.get('/courses/:id/analytics', instructorController.getCourseAnalytics);

// Course content
router.post('/courses/:id/sections', instructorController.addSection);
router.post('/courses/:id/sections/:sectionId/lessons', instructorController.addLesson);

// Quizzes (separate collection)
const quizController = require('../controllers/quizController');
router.post('/quizzes', quizController.createQuiz);
router.put('/quizzes/:id', quizController.updateQuiz);
router.delete('/quizzes/:id', quizController.deleteQuiz);
router.get('/quizzes/course/:courseId', quizController.getCourseQuizzes);
router.get('/quizzes/course/:courseId/section/:sectionIndex', quizController.getQuizBySection);

// Badges
router.post('/badges', instructorController.awardBadge);
router.get('/badges/:courseId', instructorController.getCourseBadges);

// Quiz Results
router.get('/quiz-results/:courseId', instructorController.getQuizResults);
router.post('/award-badge', instructorController.awardQuizBadge);

// Certificates
router.get('/courses/:id/certificates', instructorController.getCertificateRequests);
router.put('/certificates/:id/approve', instructorController.approveCertificateRequest);

module.exports = router;

