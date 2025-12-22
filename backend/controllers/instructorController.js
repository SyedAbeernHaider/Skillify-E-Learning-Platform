const mongoose = require('mongoose');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');
const QuizResult = require('../models/QuizResult');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Revenue = require('../models/Revenue');
const Certificate = require('../models/Certificate');
const NotificationService = require('../services/notificationService');


// @desc    Get certificate requests for a course
// @route   GET /api/instructor/courses/:id/certificates
// @access  Private (Instructor only)
exports.getCertificateRequests = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const certificates = await Certificate.find({ course: req.params.id })
            .populate('student', 'firstName lastName email profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: certificates.length,
            data: certificates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve certificate request (send to admin)
// @route   PUT /api/instructor/certificates/:id/approve
// @access  Private (Instructor only)
exports.approveCertificateRequest = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id).populate('course');

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate request not found' });
        }

        if (certificate.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        certificate.approvalStatus = 'pending_admin';
        certificate.approvedBy = req.user.id; // Instructor approved step
        certificate.approvalDate = new Date(); // Timestamp for instructor approval

        await certificate.save();

        res.status(200).json({
            success: true,
            message: 'Certificate approved and sent to Admin for generation',
            data: certificate
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/instructor/dashboard
// @access  Private (Instructor only)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const instructorId = req.user.id;

        // Get all instructor's courses
        const courses = await Course.find({ instructor: instructorId, approvalStatus: 'approved' });
        const courseIds = courses.map(course => course._id);

        // Get total enrollments
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('student', 'firstName lastName email profileImage')
            .populate('course', 'title');

        // Get total views
        const totalViews = courses.reduce((sum, course) => sum + course.totalViews, 0);

        // Get assignments and quizzes
        const assignments = await Assignment.find({ instructor: instructorId });
        const quizzes = await Quiz.find({ instructor: instructorId });

        // Get pending submissions
        const pendingSubmissions = assignments.reduce((sum, assignment) => {
            const pending = assignment.submissions.filter(sub => sub.status === 'submitted').length;
            return sum + pending;
        }, 0);

        // Get badges awarded
        const badgesAwarded = await Badge.find({ instructor: instructorId }).countDocuments();

        // Calculate revenue
        const revenueData = await Revenue.aggregate([
            { $match: { instructor: instructorId } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$instructorAmount' },
                    totalSales: { $sum: 1 },
                    platformFees: { $sum: '$platformFee' }
                }
            }
        ]);

        const revenue = revenueData[0] || { totalRevenue: 0, totalSales: 0, platformFees: 0 };

        res.status(200).json({
            success: true,
            data: {
                totalCourses: courses.length,
                totalEnrollments: enrollments.length,
                totalViews,
                totalAssignments: assignments.length,
                totalQuizzes: quizzes.length,
                totalCompletions: enrollments.filter(e => e.isCompleted).length,
                pendingSubmissions,
                badgesAwarded,
                totalRevenue: revenue.totalRevenue,
                totalSales: revenue.totalSales,
                platformFees: revenue.platformFees,
                recentEnrollments: enrollments.slice(0, 10),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get instructor's courses
// @route   GET /api/instructor/courses
// @access  Private (Instructor only)
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ instructor: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course by ID
// @route   GET /api/instructor/courses/:id
// @access  Private (Instructor only)
exports.getSingleCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Verify instructor owns this course
        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this course'
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new course
// @route   POST /api/instructor/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res, next) => {
    try {
        const {
            title,
            description,
            shortDescription,
            category,
            level,
            price,
            thumbnail,
            previewVideo,
            language,
            requirements,
            whatYouWillLearn,
            tags,
        } = req.body;

        // Validate required fields
        if (!title || !description || !shortDescription || !category || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Create course
        const course = await Course.create({
            title,
            description,
            shortDescription,
            category,
            level,
            price,
            thumbnail,
            previewVideo,
            language,
            requirements,
            whatYouWillLearn,
            tags,
            instructor: req.user.id,
            approvalStatus: 'pending',
            isFirstApproval: true,
        });

        // Notify admin about new course (you can implement this later)
        // await NotificationService.notifyAdminNewCourse(course._id, title);

        res.status(201).json({
            success: true,
            message: 'Course created successfully. Awaiting admin approval.',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course
// @route   PUT /api/instructor/courses/:id
// @access  Private (Instructor only)
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Check if instructor owns the course
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this course',
            });
        }

        // If first approval is pending, require approval for updates
        // After first approval, instructor can update without approval
        const needsApproval = course.isFirstApproval && course.approvalStatus === 'pending';

        // Update course
        Object.assign(course, req.body);

        // If needs approval, set status to pending
        if (needsApproval) {
            course.approvalStatus = 'pending';
        }

        await course.save();

        res.status(200).json({
            success: true,
            message: needsApproval
                ? 'Course updated. Awaiting admin approval.'
                : 'Course updated successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add section to course
// @route   POST /api/instructor/courses/:id/sections
// @access  Private (Instructor only)
exports.addSection = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }


        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        if (course.isContentLocked) {
            return res.status(400).json({
                success: false,
                message: 'Course content is finalized. You cannot add new sections.',
            });
        }

        const { title, description, order } = req.body;

        course.sections.push({
            title,
            description,
            order: order || course.sections.length + 1,
            lessons: [],
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Section added successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add lesson to section
// @route   POST /api/instructor/courses/:id/sections/:sectionId/lessons
// @access  Private (Instructor only)
exports.addLesson = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        if (course.isContentLocked) {
            return res.status(400).json({
                success: false,
                message: 'Course content is finalized. You cannot add new lessons.',
            });
        }

        const section = course.sections.id(req.params.sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: 'Section not found',
            });
        }

        const { title, description, videoUrl, duration, content, order, resources } = req.body;

        section.lessons.push({
            title,
            description,
            videoUrl,
            duration,
            content,
            order: order || section.lessons.length + 1,
            resources,
        });

        // Recalculate total duration
        course.calculateTotalDuration();

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Lesson added successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get course enrollments
// @route   GET /api/instructor/courses/:id/enrollments
// @access  Private (Instructor only)
exports.getCourseEnrollments = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const enrollments = await Enrollment.find({ course: req.params.id })
            .populate('student', 'firstName lastName email profileImage')
            .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Award badge to student
// @route   POST /api/instructor/badges
// @access  Private (Instructor only)
exports.awardBadge = async (req, res, next) => {
    try {
        const { studentId, courseId, title, description, icon, color, reason } = req.body;

        // Validate
        if (!studentId || !courseId || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Check if course belongs to instructor
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Create badge
        const badge = await Badge.create({
            title,
            description,
            icon,
            color,
            student: studentId,
            instructor: req.user.id,
            course: courseId,
            reason,
        });

        // Add badge to student's badges array
        await User.findByIdAndUpdate(studentId, {
            $push: { badges: badge._id },
        });

        // Notify student
        await NotificationService.notifyBadgeAwarded(studentId, title, course.title);

        res.status(201).json({
            success: true,
            message: 'Badge awarded successfully',
            data: badge,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz results for instructor's course
// @route   GET /api/instructor/quiz-results/:courseId
// @access  Private (Instructor only)
exports.getQuizResults = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const QuizResult = require('../models/QuizResult');

        // Verify instructor owns this course
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these results'
            });
        }

        const results = await QuizResult.find({ course: courseId })
            .populate('student', 'firstName lastName email')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Award badge to student based on quiz performance
// @route   POST /api/instructor/award-badge
// @access  Private (Instructor only)
exports.awardQuizBadge = async (req, res, next) => {
    try {
        const { resultId, studentId, courseId, studentName, badgeName, badgeDescription, badgeIcon } = req.body;
        const QuizResult = require('../models/QuizResult');

        // Verify instructor owns this course
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Create badge
        const badge = await Badge.create({
            name: badgeName,
            description: badgeDescription,
            icon: badgeIcon,
            student: studentId,
            course: courseId,
            instructor: req.user._id,
            awardedAt: new Date()
        });

        // Update quiz result
        await QuizResult.findByIdAndUpdate(resultId, {
            badgeAwarded: true,
            badgeId: badge._id
        });

        // Notify student
        await NotificationService.notifyBadgeAwarded(studentId, badgeName, course.title);

        res.status(201).json({
            success: true,
            message: 'Badge awarded successfully',
            data: badge
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all badges for a course
// @route   GET /api/instructor/badges/:courseId
// @access  Private (Instructor)
exports.getCourseBadges = async (req, res, next) => {
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
                message: 'Not authorized to view badges for this course'
            });
        }

        // Fetch all badges for this course
        const badges = await Badge.find({ course: courseId })
            .populate('student', 'name email')
            .sort({ awardedAt: -1 });

        // Enrich badges with section and quiz info from QuizResult
        const enrichedBadges = await Promise.all(badges.map(async (badge) => {
            const quizResult = await QuizResult.findOne({
                student: badge.student._id,
                course: courseId,
                badgeId: badge._id
            });

            return {
                _id: badge._id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                studentName: badge.student.name,
                studentEmail: badge.student.email,
                sectionIndex: quizResult?.sectionIndex,
                quizTitle: quizResult?.quizTitle,
                awardedAt: badge.awardedAt
            };
        }));

        res.status(200).json({
            success: true,
            count: enrichedBadges.length,
            data: enrichedBadges
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get course overview stats
// @route   GET /api/instructor/courses/:id/overview
// @access  Private (Instructor only)
exports.getCourseOverview = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const totalStudents = await Enrollment.countDocuments({ course: courseId });
        const recentEnrollments = await Enrollment.find({ course: courseId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('student', 'firstName lastName email profileImage');

        // Calculate average rating
        const reviews = course.reviews || [];
        const avgRating = reviews.length > 0
            ? (reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                title: course.title,
                thumbnail: course.thumbnail,
                published: course.approvalStatus === 'approved',
                totalStudents,
                totalReviews: reviews.length,
                avgRating,
                price: course.price,
                recentEnrollments
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get course analytics (Revenue & Trends)
// @route   GET /api/instructor/courses/:id/analytics
// @access  Private (Instructor only)
exports.getCourseAnalytics = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Get revenue stats for this course
        const revenueStats = await Revenue.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$instructorAmount" }, // Instructor's share
                    totalSales: { $sum: 1 },
                    grossRevenue: { $sum: "$totalAmount" }, // Total paid by students
                    platformFees: { $sum: "$platformFee" }
                }
            }
        ]);

        const stats = revenueStats[0] || { totalRevenue: 0, totalSales: 0, grossRevenue: 0, platformFees: 0 };

        // Monthly trend for this course
        const monthlyTrend = await Revenue.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$instructorAmount" },
                    sales: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                ...stats,
                monthlyTrend
            }
        });
    } catch (error) {
        next(error);
    }
};



module.exports = exports;

