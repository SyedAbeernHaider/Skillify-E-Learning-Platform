const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Instructor management
router.get('/instructors', adminController.getAllInstructorsWithStats);
router.get('/instructors/pending', adminController.getPendingInstructors);
router.put('/instructors/:id/approve', adminController.approveInstructor);
router.put('/instructors/:id/reject', adminController.rejectInstructor);
router.get('/instructors/popular', adminController.getPopularInstructors);

// Course management
router.get('/courses/instructors', adminController.getAllInstructorsWithCourses);
router.get('/courses/instructor/:instructorId', adminController.getInstructorCourses);
router.get('/courses/:courseId/details', adminController.getCourseDetails);
router.delete('/courses/:courseId', adminController.deleteCourse);
router.get('/courses/pending', adminController.getPendingCourses);
router.put('/courses/:id/approve', adminController.approveCourse);
router.put('/courses/:id/reject', adminController.rejectCourse);

// Revenue
router.get('/revenue', adminController.getRevenueStats);
router.get('/revenue/transactions', adminController.getRevenueTransactions);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);

// Certificate management
router.get('/certificates/pending', adminController.getPendingCertificates);
router.post('/certificates/:id/generate', adminController.generateCertificate);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
