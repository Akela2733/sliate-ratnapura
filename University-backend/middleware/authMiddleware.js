// university-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Load environment variables for JWT Secret
require('dotenv').config();

module.exports = function(req, res, next) {
    // Get token from header
    // The token is usually sent in the Authorization header like: "Bearer TOKEN_STRING"
    const token = req.header('x-auth-token'); // Or 'Authorization' if you prefer

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    // Verify token
    try {
        // jwt.verify takes the token and your JWT_SECRET
        // It returns the decoded payload if the token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        // This makes user data (like id, role, username) available in subsequent route handlers
        req.user = decoded.user;
        next(); // Move to the next middleware/route handler

    } catch (err) {
        // If token is invalid (e.g., expired, malformed)
        res.status(401).json({ message: 'Token is not valid.' });
    }
};