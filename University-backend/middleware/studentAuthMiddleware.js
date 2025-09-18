// server/middleware/studentAuthMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('config'); // To get your jwtSecret

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  console.log('studentAuthMiddleware: Received token:', token ? 'Yes' : 'No');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log('studentAuthMiddleware: Decoded token payload:', decoded);

    // Ensure the decoded token has a 'user' object and that the role is 'student'
    // The 'id' is expected to be nested under 'user'
    if (!decoded.user || !decoded.user.id || decoded.user.role !== 'student') {
      console.error('studentAuthMiddleware: Invalid token payload for student:', decoded);
      return res.status(403).json({ message: 'Token is not valid for a student account.' });
    }

    // Attach the decoded user payload to the request object
    req.user = decoded.user; 
    console.log('studentAuthMiddleware: req.user set to:', req.user);

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // This catches errors like invalid token, expired token, etc.
    console.error('studentAuthMiddleware: Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid or expired.' });
  }
};
