const User = require('../models/User');
const InstructorProfile = require('../models/InstructorProfile');
const NotificationService = require('../services/notificationService');

// @desc    Submit instructor profile (after signup)
// @route   POST /api/instructor/profile/submit
// @access  Private (Instructor only)
exports.submitProfile = async (req, res, next) => {
    try {
        const {
            name,
            city,
            country,
            phoneNumber,
            education,
            experience,
            expertise,
            certificateUrls,
        } = req.body;

        // Validate required fields
        if (!name || !city || !country || !phoneNumber || !education || !experience) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Validate expertise (max 5)
        if (expertise && expertise.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 expertise keywords allowed',
            });
        }

        // Check if user is an instructor
        const user = await User.findById(req.user.id);
        if (user.role !== 'instructor') {
            return res.status(403).json({
                success: false,
                message: 'Only instructors can submit profile',
            });
        }

        // Check if profile already exists
        let profile = await InstructorProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing profile
            profile.name = name;
            profile.city = city;
            profile.country = country;
            profile.phoneNumber = phoneNumber;
            profile.education = education;
            profile.experience = experience;
            profile.expertise = expertise || [];
            profile.certificateUrls = certificateUrls || [];
            profile.approvalStatus = 'pending';
            profile.submittedAt = new Date();
            await profile.save();
        } else {
            // Create new profile
            profile = await InstructorProfile.create({
                user: req.user.id,
                name,
                city,
                country,
                phoneNumber,
                education,
                experience,
                expertise: expertise || [],
                certificateUrls: certificateUrls || [],
                approvalStatus: 'pending',
            });
        }

        // Update user status
        user.instructorStatus = 'pending';
        user.instructorApplicationDate = new Date();
        user.profileCompleted = true;
        await user.save();

        // Notify admin about new instructor application
        // await NotificationService.notifyAdminNewInstructor(user._id, name);

        res.status(201).json({
            success: true,
            message: 'Profile submitted successfully. Awaiting admin approval.',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get instructor profile
// @route   GET /api/instructor/profile
// @access  Private (Instructor only)
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await InstructorProfile.findOne({ user: req.user.id })
            .populate('user', 'firstName lastName email role instructorStatus');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        if (profile.user.instructorStatus === 'approved' && profile.approvalStatus !== 'approved') {
            profile.approvalStatus = 'approved';
            if (!profile.reviewedAt) {
                profile.reviewedAt = new Date();
            }
            await profile.save();
        }

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update instructor profile
// @route   PUT /api/instructor/profile
// @access  Private (Instructor only)
exports.updateProfile = async (req, res, next) => {
    try {
        const {
            name,
            city,
            country,
            phoneNumber,
            education,
            experience,
            expertise,
            certificateUrls,
        } = req.body;

        const profile = await InstructorProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found. Please submit your profile first.',
            });
        }

        // Validate expertise (max 5)
        if (expertise && expertise.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 expertise keywords allowed',
            });
        }

        // Update fields
        if (name) profile.name = name;
        if (city) profile.city = city;
        if (country) profile.country = country;
        if (phoneNumber) profile.phoneNumber = phoneNumber;
        if (education) profile.education = education;
        if (experience) profile.experience = experience;
        if (expertise !== undefined) profile.expertise = expertise;
        if (certificateUrls !== undefined) profile.certificateUrls = certificateUrls;

        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if profile is completed
// @route   GET /api/instructor/profile/status
// @access  Private (Instructor only)
exports.getProfileStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const profile = await InstructorProfile.findOne({ user: req.user.id });

        res.status(200).json({
            success: true,
            data: {
                profileCompleted: user.profileCompleted,
                instructorStatus: user.instructorStatus,
                hasProfile: !!profile,
                profile: profile || null,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = exports;
