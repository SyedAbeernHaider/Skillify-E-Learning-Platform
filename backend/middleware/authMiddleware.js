const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user is active
        if (!req.user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Invalid token.',
        });
    }
};

// Authorize roles - check if user has required role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            }); 
        }

        next();
    };
};

// Generate JWT token
exports.generateToken = (id) => {
    return jwt.sign({ id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

// Generate refresh token
exports.generateRefreshToken = (id) => {
    return jwt.sign({ id }, jwtConfig.refreshSecret, {
        expiresIn: jwtConfig.refreshExpiresIn, 
    });
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
    try { 
        return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
        return null;
    }
};
         