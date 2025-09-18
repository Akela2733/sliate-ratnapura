// server/routes/contact.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// @route   POST /api/contact
// @desc    Submit a contact form message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    // Basic validation (more robust validation can be added with express-validator)
    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newContactMessage = new ContactMessage({
      fullName,
      email,
      message,
    });

    const savedMessage = await newContactMessage.save();
    res.status(201).json({ message: 'Message sent successfully!', data: savedMessage });

  } catch (err) {
    console.error(err.message);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// You might want an admin route to view messages later
// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private (Admin only)
/*
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.get('/', [auth, admin], async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
*/

module.exports = router;