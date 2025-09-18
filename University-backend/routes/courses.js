// university-backend/routes/courses.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/authMiddleware'); // Already imported

// Existing routes:
// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        // THIS IS THE CRUCIAL LINE: Course.find({})
        // It fetches ALL documents from the 'courses' collection
        const courses = await Course.find({});
        res.json(courses); // This should send an array of course objects
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST /api/courses
// @desc    Add a new course
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
    const { title, description, iconName, labelColor, courseCode, link, highlights } = req.body; // Added 'highlights'

    // Basic validation (add more as needed)
    if (!title || !description || !iconName || !labelColor || !courseCode) {
        return res.status(400).json({ message: 'Missing required course fields.' });
    }

    const newCourse = new Course({
        title,
        description,
        iconName,
        labelColor,
        courseCode,
        link,
        highlights // Include highlights if provided
    });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Course with this code already exists.' });
        }
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});


// NEW ROUTES BELOW:

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
// @access  Public (can be private if you only want admins to view full details)
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { // Handle invalid ID format
            return res.status(400).json({ message: 'Invalid Course ID' });
        }
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/courses/:id
// @desc    Update an existing course
// @access  Private (requires authentication)
router.put('/:id', auth, async (req, res) => {
    const { title, description, iconName, labelColor, courseCode, link, highlights } = req.body;

    // Build course fields object
    const courseFields = {
        title,
        description,
        iconName,
        labelColor,
        courseCode,
        link,
        highlights
    };

    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if another course already uses this courseCode (if changed)
        if (courseCode && courseCode !== course.courseCode) {
            const existingCourse = await Course.findOne({ courseCode });
            if (existingCourse && String(existingCourse._id) !== req.params.id) {
                return res.status(409).json({ message: 'Course with this code already exists.' });
            }
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: courseFields },
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        res.json(course);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }
        if (err.code === 11000) { // Duplicate key error
             return res.status(409).json({ message: 'Course with this code already exists.' });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (requires authentication)
router.delete('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course removed successfully' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;