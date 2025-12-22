const Course = require('../models/Course');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc    Create assignment for a lecture
// @route   POST /api/instructor/courses/:courseId/lectures/:lectureId/assignment
// @access  Private (Instructor)
exports.createAssignment = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { sectionId, assignment } = req.body;

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
                message: 'Not authorized'
            });
        }

        const section = course.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found'
            });
        }

        const lecture = section.lessons.id(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found'
            });
        }

        lecture.assignment = assignment;
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Assignment created successfully',
            data: lecture.assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get assignment for a lecture
// @route   GET /api/student/courses/:courseId/lectures/:lectureId/assignment
// @access  Private (Student)
exports.getAssignment = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { sectionId } = req.query;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const section = course.sections.id(sectionId);
        const lecture = section.lessons.id(lectureId);

        if (!lecture || !lecture.assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if student has already submitted
        const submission = await AssignmentSubmission.findOne({
            student: req.user._id,
            course: courseId,
            lectureId: lectureId
        });

        res.status(200).json({
            success: true,
            data: {
                assignment: lecture.assignment,
                submission: submission || null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Submit assignment
// @route   POST /api/student/courses/:courseId/lectures/:lectureId/assignment/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { sectionId, submissionText, submissionFile, fileName, fileType } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const section = course.sections.id(sectionId);
        const lecture = section.lessons.id(lectureId);

        if (!lecture || !lecture.assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if already submitted
        const existingSubmission = await AssignmentSubmission.findOne({
            student: req.user._id,
            course: courseId,
            lectureId: lectureId
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'Assignment already submitted. Contact instructor to resubmit.'
            });
        }

        // Create submission
        const submission = await AssignmentSubmission.create({
            student: req.user._id,
            course: courseId,
            sectionId,
            lectureId,
            assignmentTitle: lecture.assignment.title,
            submissionText,
            submissionFile,
            fileName,
            fileType
        });

        await submission.populate('student', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all assignment submissions for a lecture (Instructor)
// @route   GET /api/instructor/courses/:courseId/lectures/:lectureId/assignment/submissions
// @access  Private (Instructor)
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

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
                message: 'Not authorized'
            });
        }

        const submissions = await AssignmentSubmission.find({
            course: courseId,
            lectureId: lectureId
        })
            .populate('student', 'firstName lastName email')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Grade assignment
// @route   PUT /api/instructor/assignment-submissions/:submissionId/grade
// @access  Private (Instructor)
exports.gradeAssignment = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;

        const submission = await AssignmentSubmission.findById(submissionId)
            .populate('course')
            .populate('student', 'firstName lastName email');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check if instructor owns the course
        if (submission.course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.gradedBy = req.user._id;

        await submission.save();

        res.status(200).json({
            success: true,
            message: 'Assignment graded successfully',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update assignment
// @route   PUT /api/instructor/courses/:courseId/lectures/:lectureId/assignment
// @access  Private (Instructor)
exports.updateAssignment = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { sectionId, assignment } = req.body;

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
                message: 'Not authorized'
            });
        }

        const section = course.sections.id(sectionId);
        const lecture = section.lessons.id(lectureId);

        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: 'Lecture not found'
            });
        }

        lecture.assignment = assignment;
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Assignment updated successfully',
            data: lecture.assignment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
