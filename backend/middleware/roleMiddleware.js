// Role-based access control middleware

// Restrict to specific roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Check if user exists (should be set by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }

        next();
    };
};

// Check if user is an instructor (regardless of approval status)
exports.isInstructor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }

    if (req.user.role !== 'instructor') {
        return res.status(403).json({
            success: false,
            message: 'Only instructors can access this route',
        });
    }

    next();
};

// Check if user is an approved instructor
exports.isApprovedInstructor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }

    console.log(`🔍 Checking instructor approval for ${req.user.email}:`);
    console.log(`   - Role: ${req.user.role}`);
    console.log(`   - Status: ${req.user.instructorStatus}`);

    if (req.user.role !== 'instructor') {
        return res.status(403).json({
            success: false,
            message: 'Only instructors can access this route',
        });
    }

    if (req.user.instructorStatus !== 'approved') {
        console.log(`❌ Access denied - Status is '${req.user.instructorStatus}', not 'approved'`);
        return res.status(403).json({
            success: false,
            message: 'Your instructor application is pending approval',
        });
    }

    console.log(`✅ Access granted - Instructor is approved`);
    next();
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admins can access this route',
        });
    }

    next();
};

// Check if user is student
exports.isStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }

    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'Only students can access this route',
        });
    }

    next();
};
