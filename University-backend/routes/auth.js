// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); // This is used to get your jwtSecret from default.json
const User = require('../models/User'); // User model (for administrators)
const Student = require('../models/Student'); // Student model

// @route   POST /api/auth/login
// @desc    Authenticate User (Admin or Student) & get token
// @access  Public
router.post('/login', async (req, res) => {
  // Accept either email (for admin) or registrationNumber (for student)
  const { email, password, registrationNumber } = req.body; 

  try {
    let user = null;
    let isMatch = false;
    let loginType = ''; // To track if it's an 'admin' or 'student' login

    // Attempt login as Administrator (using email)
    if (email) {
      user = await User.findOne({ email }).select('+password'); // Fetch password for comparison
      if (user) {
        isMatch = await user.matchPassword(password);
        if (isMatch) {
          loginType = 'admin';
        }
      }
    }

    // If not an admin or password didn't match, attempt login as Student (using registrationNumber)
    // Only proceed if a registrationNumber was provided and admin login failed
    if (!isMatch && registrationNumber) {
      // Ensure registrationNumber is uppercase for database query (as per model)
      const upperCaseRegNum = registrationNumber.toUpperCase();
      user = await Student.findOne({ registrationNumber: upperCaseRegNum }).select('+password'); // Fetch password
      if (user) {
        isMatch = await user.matchPassword(password);
        if (isMatch) {
          loginType = 'student';
        }
      }
    }

    // If no user found or password didn't match for either type
    if (!user || !isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials (Email/Registration Number or Password incorrect).' });
    }

    // Generate JWT payload based on the user type
    const payload = {
      user: { // Use a consistent 'user' key in the payload for frontend AuthContext
        id: user.id,
        role: user.role,
        // Add other relevant properties based on the role
        ...(loginType === 'admin' && { username: user.username, email: user.email }),
        ...(loginType === 'student' && { registrationNumber: user.registrationNumber, name: user.name, email: user.email, department: user.department })
      }
    };

    // Sign the JWT
    jwt.sign(
      payload,
      config.get('jwtSecret'), // Get JWT secret from config (from your default.json)
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send back the token and the user object (containing role and other data)
        res.json({ message: "Login successful!", token, user: payload.user }); 
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/auth
// @desc    Get logged in user data (Admin or Student)
// @access  Private
// This route uses authMiddleware which attaches req.user
router.get('/', require('../middleware/authMiddleware'), async (req, res) => {
  try {
    // req.user.id comes from authMiddleware, which can now be either a User or Student ID
    // req.user.role also comes from authMiddleware
    let userProfile;
    if (req.user.role === 'admin') {
      userProfile = await User.findById(req.user.id).select('-password'); // Exclude password
    } else if (req.user.role === 'student') {
      userProfile = await Student.findById(req.user.id).select('-password'); // Exclude password
    } else {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
