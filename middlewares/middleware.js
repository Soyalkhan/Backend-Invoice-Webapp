const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided, not authorized to access this route' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user and exclude the password field
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(404).json({ success: false, message: 'User not found with this ID' });
        }

        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ success: false, message: 'Token verification failed, not authorized' });
    }
};
