// server/routes/events.js (Updated GET / route)

// ... (Keep your existing 'require' statements at the top)
const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Make sure path is correct for your Event model
const auth = require('../middleware/auth'); // For protecting routes
const admin = require('../middleware/admin'); // For admin-only routes

// @route   GET /api/events
// @desc    Get all events with pagination, search, sort, and upcoming/past filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const searchTerm = req.query.search || '';
    const filterType = req.query.filter || ''; // 'upcoming', 'past', or '' (for all)
    const sortOrder = req.query.sort || 'date:1'; // Default: oldest first for upcoming events

    let query = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for consistent comparison

    if (filterType === 'upcoming') {
      query.date = { $gte: today }; // Events on or after today
    } else if (filterType === 'past') {
      query.date = { $lt: today }; // Events before today
    }
    // If filterType is '', no date filter is applied (shows all)

    if (searchTerm) {
      query.$or = [ // Combine with existing query if filterType is active
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } }, // Added location to search
      ];
    }

    let sort = {};
    const [sortBy, order] = sortOrder.split(':');
    if (sortBy && (order === '1' || order === '-1')) {
      sort[sortBy] = parseInt(order);
    } else {
      // Default sort if invalid or not specified:
      // Upcoming events: oldest first (date: 1)
      // Past events: latest first (date: -1)
      // All events or no specific filter: depends on what you prefer, 'date:1' for consistent display
      sort = filterType === 'past' ? { date: -1 } : { date: 1 };
    }

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (Keep your other routes like GET /:id, POST, PUT, DELETE below this)