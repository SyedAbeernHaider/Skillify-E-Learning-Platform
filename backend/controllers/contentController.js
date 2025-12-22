const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');

// @desc    Add section to course
// @route   POST /api/instructor/courses/:courseId/sections
// @access  Private (Instructor)
exports.addSection = async (req, res) => {
    try {
        const { title, description, order } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if instructor owns the course
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const newSection = {
            title,
            description,
            order: order || course.sections.length + 1,
            lessons: []
        };

        course.sections.push(newSection);
        await course.save();

        res.status(201).json({
            success: true,
            data: course.sections[course.sections.length - 1]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update section
// @route   PUT /api/instructor/courses/:courseId/sections/:sectionId
// @access  Private (Instructor)
exports.updateSection = async (req, res) => {
    try {
        const { title, description, order } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const section = course.sections.id(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        if (title) section.title = title;
        if (description) section.description = description;
        if (order) section.order = order;

        await course.save();

        res.status(200).json({ success: true, data: section });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete section
// @route   DELETE /api/instructor/courses/:courseId/sections/:sectionId
// @access  Private (Instructor)
exports.deleteSection = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        course.sections.pull(req.params.sectionId);
        await course.save();

        res.status(200).json({ success: true, message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add lesson to section
// @route   POST /api/instructor/courses/:courseId/sections/:sectionId/lessons
// @access  Private (Instructor)
exports.addLesson = async (req, res) => {
    try {
        const { title, description, videoUrl, duration, order } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const section = course.sections.id(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        const newLesson = {
            title,
            description,
            videoUrl,
            duration: duration || 0,
            order: order || section.lessons.length + 1
        };

        section.lessons.push(newLesson);
        await course.save();

        res.status(201).json({
            success: true,
            data: section.lessons[section.lessons.length - 1]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update lesson
// @route   PUT /api/instructor/courses/:courseId/sections/:sectionId/lessons/:lessonId
// @access  Private (Instructor)
exports.updateLesson = async (req, res) => {
    try {
        const { title, description, videoUrl, duration, order } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const section = course.sections.id(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        const lesson = section.lessons.id(req.params.lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        if (title) lesson.title = title;
        if (description) lesson.description = description;
        if (videoUrl) lesson.videoUrl = videoUrl;
        if (duration !== undefined) lesson.duration = duration;
        if (order) lesson.order = order;

        await course.save();

        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/instructor/courses/:courseId/sections/:sectionId/lessons/:lessonId
// @access  Private (Instructor)
exports.deleteLesson = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const section = course.sections.id(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found' });
        }

        section.lessons.pull(req.params.lessonId);
        await course.save();

        res.status(200).json({ success: true, message: 'Lesson deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get course with all content
// @route   GET /api/instructor/courses/:courseId
// @access  Private (Instructor)
exports.getCourseWithContent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('instructor', 'firstName lastName email');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.instructor._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: { course } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
