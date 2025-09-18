// server/routes/news.js
const express = require('express');
const router = express.Router();
const News = require('../models/News'); // Make sure path is correct for your News model
const auth = require('../middleware/auth'); // For protecting routes
const admin = require('../middleware/admin'); // For admin-only routes

// @route   GET /api/news
// @desc    Get all news articles with pagination, search, and sort
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3; // Default limit matches frontend
    const searchTerm = req.query.search || '';
    const sortOrder = req.query.sort || 'date:-1'; // Default: latest first

    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive title search
          { content: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive content search
        ],
      };
    }

    let sort = {};
    const [sortBy, order] = sortOrder.split(':');
    if (sortBy && (order === '1' || order === '-1')) {
      sort[sortBy] = parseInt(order);
    } else {
      sort = { date: -1 }; // Default sort if invalid
    }

    const totalNews = await News.countDocuments(query);
    const news = await News.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(totalNews / limit),
      totalNews,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/news/:id
// @desc    Get single news article by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (err) {
    console.error(err.message);
    // If ID is not a valid ObjectId, Mongoose will throw a CastError
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/news
// @desc    Add new news article
// @access  Private (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  const { title, content, date, imageURL } = req.body;

  try {
    const newNews = new News({
      title,
      content,
      date,
      imageURL,
    });

    const news = await newNews.save();
    res.status(201).json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/news/:id
// @desc    Update a news article
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { title, content, date, imageURL } = req.body;

  try {
    let news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    news.title = title || news.title;
    news.content = content || news.content;
    news.date = date || news.date;
    news.imageURL = imageURL || news.imageURL;

    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete a news article
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await News.deleteOne({ _id: req.params.id }); // Use deleteOne or findByIdAndDelete
    res.json({ message: 'News article removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;