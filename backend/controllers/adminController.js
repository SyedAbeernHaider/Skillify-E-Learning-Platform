const User = require('../models/User');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const Revenue = require('../models/Revenue');
const Enrollment = require('../models/Enrollment');
const Setting = require('../models/Setting');
const NotificationService = require('../services/notificationService');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Count users by role
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstructors = await User.countDocuments({
            role: 'instructor',
            instructorStatus: 'approved'
        });
        const pendingInstructors = await User.countDocuments({
            role: 'instructor',
            instructorStatus: 'pending'
        });

        // Count courses
        const totalCourses = await Course.countDocuments({ approvalStatus: 'approved' });
        const pendingCourses = await Course.countDocuments({ approvalStatus: 'pending' });

        // Count enrollments
        const totalEnrollments = await Enrollment.countDocuments();

        // Calculate revenue
        const revenueData = await Revenue.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    platformRevenue: { $sum: '$platformFee' },
                    instructorRevenue: { $sum: '$instructorAmount' },
                },
            },
        ]);

        const revenue = revenueData[0] || {
            totalRevenue: 0,
            platformRevenue: 0,
            instructorRevenue: 0,
        };

        // Pending certificates
        const pendingCertificates = await Certificate.countDocuments({
            approvalStatus: 'pending'
        });

        res.status(200).json({
            success: true,
            data: {
                users: {
                    totalStudents,
                    totalInstructors,
                    pendingInstructors,
                },
                courses: {
                    totalCourses,
                    pendingCourses,
                },
                totalEnrollments,
                revenue,
                pendingCertificates,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending instructor applications
// @route   GET /api/admin/instructors/pending
// @access  Private (Admin only)
exports.getPendingInstructors = async (req, res, next) => {
    try {
        const InstructorProfile = require('../models/InstructorProfile');

        const pendingInstructors = await User.find({
            role: 'instructor',
            instructorStatus: 'pending'
        })
            .select('firstName lastName email role instructorStatus instructorApplicationDate profileCompleted')
            .sort({ instructorApplicationDate: -1 })
            .lean(); // Convert to plain JavaScript objects

        console.log('📋 Found pending instructors:', pendingInstructors.length);

        // Get profiles for each instructor
        const instructorsWithProfiles = await Promise.all(
            pendingInstructors.map(async (instructor) => {
                console.log(`🔍 Looking for profile for user: ${instructor._id}`);

                const profile = await InstructorProfile.findOne({ user: instructor._id })
                    .select('name city country phoneNumber education experience expertise certificateUrls approvalStatus submittedAt')
                    .lean();

                console.log(`📝 Profile found for ${instructor.email}:`, profile ? 'YES' : 'NO');
                if (profile) {
                    console.log(`   - Name: ${profile.name}, City: ${profile.city}`);
                }

                return {
                    ...instructor,
                    profile: profile || null,
                };
            })
        );

        console.log('✅ Sending', instructorsWithProfiles.length, 'instructors with profiles');

        res.status(200).json({
            success: true,
            count: instructorsWithProfiles.length,
            data: instructorsWithProfiles,
        });
    } catch (error) {
        console.error('Error in getPendingInstructors:', error);
        next(error);
    }
};

// @desc    Approve instructor application
// @route   PUT /api/admin/instructors/:id/approve
// @access  Private (Admin only)
exports.approveInstructor = async (req, res, next) => {
    try {
        const instructor = await User.findById(req.params.id);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found',
            });
        }

        if (instructor.role !== 'instructor') {
            return res.status(400).json({
                success: false,
                message: 'User is not an instructor',
            });
        }

        instructor.instructorStatus = 'approved';
        instructor.instructorApprovalDate = new Date();
        await instructor.save();

        // Send notification
        await NotificationService.notifyInstructorApproved(instructor._id);

        res.status(200).json({
            success: true,
            message: 'Instructor approved successfully',
            data: instructor,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject instructor application
// @route   PUT /api/admin/instructors/:id/reject
// @access  Private (Admin only)
exports.rejectInstructor = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const instructor = await User.findById(req.params.id);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found',
            });
        }

        // Update instructor profile with rejection reason
        const InstructorProfile = require('../models/InstructorProfile');
        const profile = await InstructorProfile.findOne({ user: instructor._id });

        if (profile) {
            profile.approvalStatus = 'rejected';
            profile.rejectionReason = reason || 'Your application did not meet our requirements';
            profile.reviewedAt = new Date();
            await profile.save();
        }

        // Update user status to rejected
        instructor.instructorStatus = 'rejected';
        await instructor.save();

        // Send notification
        await NotificationService.notifyInstructorRejected(instructor._id, reason);

        res.status(200).json({
            success: true,
            message: 'Instructor application rejected',
            data: instructor,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending courses
// @route   GET /api/admin/courses/pending
// @access  Private (Admin only)
exports.getPendingCourses = async (req, res, next) => {
    try {
        const pendingCourses = await Course.find({ approvalStatus: 'pending' })
            .populate('instructor', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingCourses.length,
            data: pendingCourses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve course
// @route   PUT /api/admin/courses/:id/approve
// @access  Private (Admin only)
exports.approveCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        course.approvalStatus = 'approved';
        course.approvalDate = new Date();
        course.isFirstApproval = false;
        course.isPublished = true;
        await course.save();

        // Send notification to instructor
        await NotificationService.notifyCourseApproved(
            course.instructor,
            course._id,
            course.title
        );

        res.status(200).json({
            success: true,
            message: 'Course approved successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject course
// @route   PUT /api/admin/courses/:id/reject
// @access  Private (Admin only)
exports.rejectCourse = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        course.approvalStatus = 'rejected';
        course.rejectionReason = reason;
        await course.save();

        // Send notification to instructor
        await NotificationService.notifyCourseRejected(
            course.instructor,
            course._id,
            course.title,
            reason
        );

        res.status(200).json({
            success: true,
            message: 'Course rejected',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get revenue statistics
// @route   GET /api/admin/revenue
// @access  Private (Admin only)
exports.getRevenueStats = async (req, res, next) => {
    try {
        // Overall revenue
        const overallRevenue = await Revenue.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    platformRevenue: { $sum: '$platformFee' },
                    instructorRevenue: { $sum: '$instructorAmount' },
                    totalTransactions: { $sum: 1 },
                },
            },
        ]);

        // Revenue by instructor
        const revenueByInstructor = await Revenue.aggregate([
            {
                $group: {
                    _id: '$instructor',
                    totalRevenue: { $sum: '$instructorAmount' },
                    totalSales: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'instructor',
                },
            },
            {
                $unwind: '$instructor',
            },
            {
                $project: {
                    instructorName: {
                        $concat: ['$instructor.firstName', ' ', '$instructor.lastName'],
                    },
                    instructorEmail: '$instructor.email',
                    totalRevenue: 1,
                    totalSales: 1,
                },
            },
            {
                $sort: { totalRevenue: -1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                overall: overallRevenue[0] || {
                    totalRevenue: 0,
                    platformRevenue: 0,
                    instructorRevenue: 0,
                    totalTransactions: 0,
                },
                byInstructor: revenueByInstructor,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get revenue transactions
// @route   GET /api/admin/revenue/transactions
// @access  Private (Admin)
exports.getRevenueTransactions = async (req, res, next) => {
    try {
        const transactions = await Revenue.find()
            .populate('course', 'title category')
            .populate('student', 'firstName lastName email')
            .populate('instructor', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get most popular instructors
// @route   GET /api/admin/instructors/popular
// @access  Private (Admin only)
exports.getPopularInstructors = async (req, res, next) => {
    try {
        const popularInstructors = await Course.aggregate([
            {
                $match: { approvalStatus: 'approved' },
            },
            {
                $group: {
                    _id: '$instructor',
                    totalEnrollments: { $sum: '$totalEnrollments' },
                    totalCourses: { $sum: 1 },
                    totalViews: { $sum: '$totalViews' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'instructor',
                },
            },
            {
                $unwind: '$instructor',
            },
            {
                $project: {
                    instructorName: {
                        $concat: ['$instructor.firstName', ' ', '$instructor.lastName'],
                    },
                    instructorEmail: '$instructor.email',
                    profileImage: '$instructor.profileImage',
                    totalEnrollments: 1,
                    totalCourses: 1,
                    totalViews: 1,
                },
            },
            {
                $sort: { totalEnrollments: -1 },
            },
            {
                $limit: 10,
            },
        ]);

        res.status(200).json({
            success: true,
            data: popularInstructors,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;

        const query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Deactivate/activate user
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve certificate
// @route   PUT /api/admin/certificates/:id/approve
// @access  Private (Admin only)
exports.approveCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate('course', 'title');

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found',
            });
        }

        certificate.approvalStatus = 'approved';
        certificate.approvedBy = req.user.id;
        certificate.approvalDate = new Date();
        certificate.issueDate = new Date();
        await certificate.save();

        // Notify student
        await NotificationService.notifyCertificateApproved(
            certificate.student,
            certificate.course.title
        );

        res.status(200).json({
            success: true,
            message: 'Certificate approved successfully',
            data: certificate,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all instructors with their course counts (for admin courses page)
// @route   GET /api/admin/courses/instructors
// @access  Private (Admin only)
exports.getAllInstructorsWithCourses = async (req, res, next) => {
    try {
        const instructors = await User.find({
            role: 'instructor',
            instructorStatus: 'approved'
        })
            .select('firstName lastName email instructorApprovalDate')
            .lean();

        // Get course count for each instructor
        const instructorsWithCourses = await Promise.all(
            instructors.map(async (instructor) => {
                const courseCount = await Course.countDocuments({ instructor: instructor._id });
                return {
                    ...instructor,
                    courseCount
                };
            })
        );

        res.status(200).json({
            success: true,
            count: instructorsWithCourses.length,
            data: instructorsWithCourses,
        });
    } catch (error) {
        console.error('Error in getAllInstructorsWithCourses:', error);
        next(error);
    }
};

// @desc    Get all courses by a specific instructor
// @route   GET /api/admin/courses/instructor/:instructorId
// @access  Private (Admin only)
exports.getInstructorCourses = async (req, res, next) => {
    try {
        const { instructorId } = req.params;

        const courses = await Course.find({ instructor: instructorId })
            .populate('instructor', 'firstName lastName email')
            .populate('category', 'name')
            .select('title description price level thumbnail enrollmentCount rating approvalStatus createdAt')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        console.error('Error in getInstructorCourses:', error);
        next(error);
    }
};

// @desc    Get course details with all sections and lectures
// @route   GET /api/admin/courses/:courseId/details
// @access  Private (Admin only)
exports.getCourseDetails = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate('instructor', 'firstName lastName email')
            .populate('category', 'name')
            .lean();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Count enrollments
        const enrollmentCount = await Enrollment.countDocuments({ course: courseId });

        res.status(200).json({
            success: true,
            data: {
                ...course,
                enrollmentCount
            },
        });
    } catch (error) {
        console.error('Error in getCourseDetails:', error);
        next(error);
    }
};

// @desc    Delete a course (admin only)
// @route   DELETE /api/admin/courses/:courseId
// @access  Private (Admin only)
exports.deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        // Check if course has enrollments
        const enrollmentCount = await Enrollment.countDocuments({ course: courseId });

        if (enrollmentCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete course with ${enrollmentCount} active enrollments. Please contact students first.`,
            });
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        console.log(`🗑️ Course deleted by admin: ${course.title} (ID: ${courseId})`);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteCourse:', error);
        next(error);
    }
};

// @desc    Get all instructors with detailed statistics (for admin instructors page)
// @route   GET /api/admin/instructors
// @access  Private (Admin only)
exports.getAllInstructorsWithStats = async (req, res, next) => {
    try {
        const instructors = await User.find({
            role: 'instructor',
            instructorStatus: 'approved'
        })
            .select('firstName lastName email instructorApprovalDate createdAt')
            .lean();

        // Get detailed stats for each instructor
        const instructorsWithStats = await Promise.all(
            instructors.map(async (instructor) => {
                // Count courses
                const courseCount = await Course.countDocuments({ instructor: instructor._id });

                // Get all course IDs for this instructor
                const courses = await Course.find({ instructor: instructor._id }).select('_id');
                const courseIds = courses.map(c => c._id);

                // Count total enrollments across all courses
                const totalEnrollments = await Enrollment.countDocuments({
                    course: { $in: courseIds }
                });

                // Calculate total revenue (instructor's share)
                const revenueData = await Revenue.aggregate([
                    {
                        $match: { instructor: instructor._id }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$instructorAmount' },
                            totalSales: { $sum: 1 }
                        }
                    }
                ]);

                const revenue = revenueData[0] || { totalRevenue: 0, totalSales: 0 };

                return {
                    ...instructor,
                    courseCount,
                    totalEnrollments,
                    totalRevenue: revenue.totalRevenue,
                    totalSales: revenue.totalSales
                };
            })
        );

        // Sort by total revenue (highest first)
        instructorsWithStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

        res.status(200).json({
            success: true,
            count: instructorsWithStats.length,
            data: instructorsWithStats,
        });
    } catch (error) {
        console.error('Error in getAllInstructorsWithStats:', error);
        next(error);
    }
};


// @desc    Get pending certificates (admin)
// @route   GET /api/admin/certificates/pending
// @access  Private (Admin)
exports.getPendingCertificates = async (req, res, next) => {
    try {
        const certs = await Certificate.find({ approvalStatus: 'pending_admin' })
            .populate('student', 'firstName lastName email')
            .populate('course', 'title')
            .populate('instructor', 'firstName lastName');
        res.status(200).json({ success: true, count: certs.length, data: certs });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate and Issue Certificate
// @route   POST /api/admin/certificates/:id/generate
// @access  Private (Admin)
exports.generateCertificate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cert = await Certificate.findById(id).populate('student course');

        if (!cert) {
            return res.status(404).json({ success: false, message: 'Certificate request not found' });
        }

        // Logic to generate image
        // 1. Load Template

        // Destructure explicit exports from new Jimp structure
        // Based on file inspection: exports.Jimp and exports.loadFont exist
        const jimpPackage = require('jimp');
        const Jimp = jimpPackage.Jimp;
        const loadFont = jimpPackage.loadFont;

        let fontConstants = {};
        try {
            // 1. Try standard export
            fontConstants = require('jimp/fonts');
        } catch (e) {
            console.log('Could not require jimp/fonts', e.message);
        }

        if (!fontConstants || !fontConstants.FONT_SANS_32_BLACK) {
            try {
                // 2. Try direct internal import from dist
                fontConstants = require('jimp/dist/commonjs/fonts');
            } catch (e) {
                console.log('Could not require jimp/dist/commonjs/fonts', e.message);
            }
        }

        if (!fontConstants || !fontConstants.FONT_SANS_32_BLACK) {
            try {
                // 3. Try plugin direct import (if hoisted)
                fontConstants = require('@jimp/plugin-print/fonts');
            } catch (e) {
                console.log('Could not require @jimp/plugin-print/fonts', e.message);
            }
        }

        // Fallback: Check if they are on the Jimp class or package
        if (!fontConstants.FONT_SANS_32_BLACK) {
            if (Jimp.FONT_SANS_32_BLACK) Object.assign(fontConstants, Jimp);
            else if (jimpPackage.FONT_SANS_32_BLACK) Object.assign(fontConstants, jimpPackage);
        }

        // Correct path based on file listing: 'upload/certicate.png' (typo in filename preserved)
        const templatePath = path.join(__dirname, '../public/upload/certicate.png');
        let image;

        console.log('Using template path:', templatePath);

        // Create a clean certificate instead of using template with baked-in text
        console.log('Creating clean certificate template...');

        // Create white background (1200x850 for better quality)
        image = new Jimp({ width: 1200, height: 850, color: 0xFFFFFFFF });

        // Add decorative purple/blue border
        const borderColor = 0x667EEAFF;
        const borderWidth = 20;

        // Draw outer border
        for (let i = 0; i < borderWidth; i++) {
            // Top and bottom borders
            for (let x = 0; x < image.bitmap.width; x++) {
                image.setPixelColor(borderColor, x, i);
                image.setPixelColor(borderColor, x, image.bitmap.height - 1 - i);
            }
            // Left and right borders
            for (let y = 0; y < image.bitmap.height; y++) {
                image.setPixelColor(borderColor, i, y);
                image.setPixelColor(borderColor, image.bitmap.width - 1 - i, y);
            }
        }

        // Add inner decorative line (light gray)
        const innerBorder = 40;
        const innerColor = 0xD1D5DBFF;
        const lineWidth = 2;
        for (let i = 0; i < lineWidth; i++) {
            for (let x = innerBorder; x < image.bitmap.width - innerBorder; x++) {
                image.setPixelColor(innerColor, x, innerBorder + i);
                image.setPixelColor(innerColor, x, image.bitmap.height - innerBorder - i);
            }
            for (let y = innerBorder; y < image.bitmap.height - innerBorder; y++) {
                image.setPixelColor(innerColor, innerBorder + i, y);
                image.setPixelColor(innerColor, image.bitmap.width - innerBorder - i, y);
            }
        }

        console.log('Clean certificate template created successfully.');

        // 2. Load Fonts
        // Use the standalone loadFont function
        let fontTitle, fontText, fontLg;

        try {
            console.log('Attempting to resolve font paths manually...');

            // Go up from controllers -> backend -> node_modules
            const baseFontPath = path.join(__dirname, '../node_modules/@jimp/plugin-print/fonts/open-sans');

            const FONT_32 = path.join(baseFontPath, 'open-sans-32-black/open-sans-32-black.fnt');
            const FONT_16 = path.join(baseFontPath, 'open-sans-16-black/open-sans-16-black.fnt');
            const FONT_64 = path.join(baseFontPath, 'open-sans-64-black/open-sans-64-black.fnt');

            console.log('Fonts resolved:', { FONT_32 });

            if (!fs.existsSync(FONT_32)) {
                console.log(`Font file MISSING at path: ${FONT_32}`);
                throw new Error(`Font file not found at path: ${FONT_32}`);
            } else {
                console.log('Verified: FONT_32 exists on disk.');
            }

            // Check PNG existence too (assumed from FNT content)
            const pngPath = FONT_32.replace('.fnt', '.png');
            if (!fs.existsSync(pngPath)) {
                console.log(`Associated PNG file MISSING at path: ${pngPath}`);
            } else {
                console.log('Verified: associated PNG exists on disk.');
            }

            fontTitle = await loadFont(FONT_32);
            fontText = await loadFont(FONT_16);
            fontLg = await loadFont(FONT_64);

            console.log('Fonts loaded successfully.');

        } catch (fontErr) {
            console.log('Font loading failed.');
            try {
                const msg = fontErr instanceof Error ? fontErr.message : String(fontErr);
                console.log('Error details:', msg);
            } catch (e) {
                console.log('Could not log error details');
            }
            throw new Error('Failed to load fonts');
        }

        // 3. Draw Text (Simple Centered Logic)
        if (!image || !image.bitmap) {
            throw new Error("Image buffer invalid or not initialized");
        }

        const w = image.bitmap.width;
        // Use HorizontalAlign from package or Jimp
        const ALIGN_CENTER = jimpPackage.HorizontalAlign ? jimpPackage.HorizontalAlign.CENTER :
            (Jimp.HORIZONTAL_ALIGN_CENTER || 2); // 2 is usually CENTER

        console.log('Drawing text...');

        // Verify data from database
        console.log('Certificate data:', {
            studentFirstName: cert.student?.firstName,
            studentLastName: cert.student?.lastName,
            courseTitle: cert.course?.title,
            certificateNumber: cert.certificateNumber
        });

        const studentName = `${cert.student.firstName} ${cert.student.lastName}`;
        const courseTitle = cert.course.title;

        console.log('Rendering certificate for:', studentName, 'Course:', courseTitle);

        image.print({
            font: fontTitle,
            x: 0,
            y: 100,
            text: {
                text: 'CERTIFICATE OF COMPLETION',
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontText,
            x: 0,
            y: 200,
            text: {
                text: 'This is to certify that',
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontLg,
            x: 0,
            y: 250,
            text: {
                text: studentName,
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontText,
            x: 0,
            y: 380,
            text: {
                text: 'has successfully completed the course',
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontTitle,
            x: 0,
            y: 430,
            text: {
                text: courseTitle,
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontText,
            x: 0,
            y: 550,
            text: {
                text: `Issued on: ${new Date().toLocaleDateString()}`,
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        image.print({
            font: fontText,
            x: 0,
            y: 600,
            text: {
                text: `ID: ${cert.certificateNumber}`,
                alignmentX: ALIGN_CENTER
            },
            maxWidth: w
        });

        // 4. Save
        // Use consistent filename (without timestamp) so it overwrites old files
        const fileName = `cert-${cert.certificateNumber}.png`;
        const outputDir = path.join(__dirname, '../public/uploads/certificates');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Delete old certificate file if it exists
        if (cert.certificateUrl) {
            try {
                const oldFileName = cert.certificateUrl.split('/').pop();
                const oldFilePath = path.join(outputDir, oldFileName);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log('Deleted old certificate file:', oldFileName);
                }
            } catch (err) {
                console.log('Could not delete old certificate file:', err.message);
            }
        }

        const outputPath = path.join(outputDir, fileName);
        console.log('Saving certificate to:', outputPath);
        await image.write(outputPath);
        console.log('Certificate saved successfully!');

        // 5. Update DB
        const port = process.env.PORT || 1000;
        const baseUrl = process.env.API_URL || `http://localhost:${port}`;
        const publicUrl = `${baseUrl}/uploads/certificates/${fileName}`;

        console.log('Certificate public URL:', publicUrl);

        cert.certificateUrl = publicUrl;
        cert.approvalStatus = 'approved';
        cert.issueDate = new Date();
        cert.approvedBy = req.user.id;

        await cert.save();

        // 6. Notify Student
        await NotificationService.notifyCertificateApproved(cert.student._id, cert.course.title);

        // Notify Instructor?
        // await NotificationService.notifyInstructor(cert.instructor, 'Certificate Issued', `Certificate for ${studentName} in ${cert.course.title} has been issued by Admin.`);

        res.status(200).json({
            success: true,
            message: 'Certificate generated and issued successfully',
            data: cert
        });

    } catch (error) {
        console.log("Gen Cert Error:", error.message || String(error));
        next(error);
    }
};

// @desc    Get comprehensive analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
    try {
        // 1. User Statistics
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalInstructors = await User.countDocuments({ role: 'instructor', instructorStatus: 'approved' });
        const pendingInstructors = await User.countDocuments({ role: 'instructor', instructorStatus: 'pending' });
        const activeUsers = await User.countDocuments({ isActive: true });

        // User growth over last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 2. Course Statistics
        const totalCourses = await Course.countDocuments();
        const approvedCourses = await Course.countDocuments({ approvalStatus: 'approved' });
        const pendingCourses = await Course.countDocuments({ approvalStatus: 'pending' });
        const rejectedCourses = await Course.countDocuments({ approvalStatus: 'rejected' });

        // Courses by category
        const coursesByCategory = await Course.aggregate([
            { $match: { approvalStatus: 'approved' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Courses by level
        const coursesByLevel = await Course.aggregate([
            { $match: { approvalStatus: 'approved' } },
            { $group: { _id: '$level', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 3. Enrollment Statistics
        const totalEnrollments = await Enrollment.countDocuments();
        const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
        const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });

        // Enrollment growth over last 6 months
        const enrollmentGrowth = await Enrollment.aggregate([
            { $match: { enrolledAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$enrolledAt' },
                        month: { $month: '$enrolledAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Average completion rate
        const completionRate = totalEnrollments > 0
            ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
            : 0;

        // 4. Revenue Statistics
        const revenueData = await Revenue.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    platformRevenue: { $sum: '$platformFee' },
                    instructorRevenue: { $sum: '$instructorAmount' }
                }
            }
        ]);

        const revenue = revenueData[0] || {
            totalRevenue: 0,
            platformRevenue: 0,
            instructorRevenue: 0
        };

        // Revenue over last 6 months
        const revenueGrowth = await Revenue.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$totalAmount' },
                    platformRevenue: { $sum: '$platformFee' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 5. Popular Courses (Top 10 by enrollments)
        const popularCourses = await Course.aggregate([
            { $match: { approvalStatus: 'approved' } },
            {
                $lookup: {
                    from: 'enrollments',
                    localField: '_id',
                    foreignField: 'course',
                    as: 'enrollments'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    price: 1,
                    rating: 1,
                    enrollmentCount: { $size: '$enrollments' }
                }
            },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 10 }
        ]);

        // 6. Top Instructors (by total enrollments)
        const topInstructors = await User.aggregate([
            { $match: { role: 'instructor', instructorStatus: 'approved' } },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'instructor',
                    as: 'courses'
                }
            },
            {
                $lookup: {
                    from: 'enrollments',
                    localField: 'courses._id',
                    foreignField: 'course',
                    as: 'enrollments'
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    courseCount: { $size: '$courses' },
                    enrollmentCount: { $size: '$enrollments' }
                }
            },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 10 }
        ]);

        // 7. Certificate Statistics
        const totalCertificates = await Certificate.countDocuments();
        const approvedCertificates = await Certificate.countDocuments({ approvalStatus: 'approved' });
        const pendingCertificates = await Certificate.countDocuments({
            approvalStatus: { $in: ['pending_instructor', 'pending_admin'] }
        });

        // 8. Recent Activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const recentCourses = await Course.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const recentEnrollments = await Enrollment.countDocuments({ enrolledAt: { $gte: thirtyDaysAgo } });

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    instructors: totalInstructors,
                    pendingInstructors,
                    active: activeUsers,
                    growth: userGrowth
                },
                courses: {
                    total: totalCourses,
                    approved: approvedCourses,
                    pending: pendingCourses,
                    rejected: rejectedCourses,
                    byCategory: coursesByCategory,
                    byLevel: coursesByLevel,
                    popular: popularCourses
                },
                enrollments: {
                    total: totalEnrollments,
                    active: activeEnrollments,
                    completed: completedEnrollments,
                    completionRate: parseFloat(completionRate),
                    growth: enrollmentGrowth
                },
                revenue: {
                    total: revenue.totalRevenue,
                    platform: revenue.platformRevenue,
                    instructor: revenue.instructorRevenue,
                    growth: revenueGrowth
                },
                certificates: {
                    total: totalCertificates,
                    approved: approvedCertificates,
                    pending: pendingCertificates
                },
                topInstructors,
                recentActivity: {
                    newUsers: recentUsers,
                    newCourses: recentCourses,
                    newEnrollments: recentEnrollments
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get global settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Setting.getSettings();
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update global settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res, next) => {
    try {
        const { platformFeePercentage, studentRegistrationEnabled, instructorRegistrationEnabled } = req.body;

        // Find existing settings
        let settings = await Setting.getSettings();

        // Update fields if provided
        if (platformFeePercentage !== undefined) settings.platformFeePercentage = platformFeePercentage;
        if (studentRegistrationEnabled !== undefined) settings.studentRegistrationEnabled = studentRegistrationEnabled;
        if (instructorRegistrationEnabled !== undefined) settings.instructorRegistrationEnabled = instructorRegistrationEnabled;

        settings.updatedBy = req.user.id;
        await settings.save();

        res.status(200).json({
            success: true,
            data: settings,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

