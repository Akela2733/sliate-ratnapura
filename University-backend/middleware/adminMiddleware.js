// server/middleware/adminMiddleware.js
module.exports = function (req, res, next) {
  // Assuming authMiddleware has already run and attached req.user
  // If req.user is not set, it means authentication failed or authMiddleware didn't run
  if (!req.user) {
    return res.status(401).json({ message: 'No user data found, authorization denied. (Auth middleware missing or failed?)' });
  }

  // Check if the authenticated user's role is 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: You must be an administrator to perform this action.' });
  }

  // If user is an admin, proceed to the next middleware/route handler
  next();
};