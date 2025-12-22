const User = require('../models/User');
const Setting = require('../models/Setting');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/authMiddleware');
const NotificationService = require('../services/notificationService');

// @desc    Register user (Student or Instructor application)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            city,
            country,
            // Instructor specific fields
            expertise,
            experience,
            education,
        } = req.body;

        // Check availability
        const settings = await Setting.getSettings();
        if (role === 'instructor' && !settings.instructorRegistrationEnabled) {
            return res.status(403).json({
                success: false,
                message: 'Instructor registration is currently disabled by admin.'
            });
        }
        if ((!role || role === 'student') && !settings.studentRegistrationEnabled) {
            return res.status(403).json({
                success: false,
                message: 'Student registration is currently disabled by admin.'
            });
        }

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create user object
        const userData = {
            firstName,
            lastName,
            email,
            password,
            role: role || 'student',
            city,
            country,
        };

        // If registering as instructor, don't set pending status yet
        // They need to complete the profile form first
        if (role === 'instructor') {
            userData.instructorStatus = 'none';
            userData.profileCompleted = false;
        }

        // Create user
        const user = await User.create(userData);

        // Generate token
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(201).json({
            success: true,
            message: role === 'instructor'
                ? 'Registration successful. Please complete your profile to apply as an instructor.'
                : 'Registration successful',
            data: {
                user,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        // Check if user has a password (might not if created through OAuth or admin)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'This account does not have a password set. Please use an alternative login method or reset your password.',
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        // Get user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Generate new tokens
        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            bio,
            city,
            country,
            phone,
            profileImage,
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (bio !== undefined) user.bio = bio;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
            });
        }

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark first login as complete
// @route   PUT /api/auth/complete-first-login
// @access  Private
exports.completeFirstLogin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.isFirstLogin = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'First login completed',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register admin with secret key
// @route   POST /api/auth/register-admin
// @access  Public (but requires secret key)
exports.registerAdmin = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            secretKey
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !secretKey) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields including secret key',
            });
        }

        // Validate secret key
        const ADMIN_SECRET_KEY = 'admin000';
        if (secretKey !== ADMIN_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: 'Invalid admin secret key. You are not authorized to create an admin account.',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create admin user
        const adminUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: 'admin',
            isActive: true,
            isApproved: true
        });

        // Generate token
        const token = generateToken(adminUser._id);
        const refreshToken = generateRefreshToken(adminUser._id);

        // Remove password from response
        adminUser.password = undefined;

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                user: adminUser,
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};
