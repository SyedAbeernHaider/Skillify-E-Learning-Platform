const express = require('express');
const router = express.Router();
const {
    addSection,
    updateSection,
    deleteSection,
    addLesson,
    updateLesson,
    deleteLesson,
    getCourseWithContent
} = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Course content routes
router.get('/courses/:courseId', getCourseWithContent);

// Section routes
router.post('/courses/:courseId/sections', addSection);
router.put('/courses/:courseId/sections/:sectionId', updateSection);
router.delete('/courses/:courseId/sections/:sectionId', deleteSection);

// Lesson routes
router.post('/courses/:courseId/sections/:sectionId/lessons', addLesson);
router.put('/courses/:courseId/sections/:sectionId/lessons/:lessonId', updateLesson);
router.delete('/courses/:courseId/sections/:sectionId/lessons/:lessonId', deleteLesson);

module.exports = router;
