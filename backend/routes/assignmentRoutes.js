const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Instructor routes
router.post(
    '/instructor/courses/:courseId/lectures/:lectureId/assignment',
    protect,
    authorize('instructor'),
    assignmentController.createAssignment
);

router.put(
    '/instructor/courses/:courseId/lectures/:lectureId/assignment',
    protect,
    authorize('instructor'),
    assignmentController.updateAssignment
);

router.get(
    '/instructor/courses/:courseId/lectures/:lectureId/assignment/submissions',
    protect,
    authorize('instructor'),
    assignmentController.getAssignmentSubmissions
);

router.put(
    '/instructor/assignment-submissions/:submissionId/grade',
    protect,
    authorize('instructor'),
    assignmentController.gradeAssignment
);

// Student routes
router.get(
    '/student/courses/:courseId/lectures/:lectureId/assignment',
    protect,
    authorize('student'),
    assignmentController.getAssignment
);

router.post(
    '/student/courses/:courseId/lectures/:lectureId/assignment/submit',
    protect,
    authorize('student'),
    assignmentController.submitAssignment
);

module.exports = router;
