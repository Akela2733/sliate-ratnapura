// university-backend/server.js

// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer"); // For sending emails (Contact form)
const slugify = require("slugify"); // Used in schema pre-save hooks, but good to ensure it's available

// Import Mongoose Models (Ensure these paths are correct relative to server.js)
const News = require("./models/News");
const Event = require("./models/Events");
const ContactMessage = require("./models/ContactMessage");
const Staff = require("./models/Staff");
const Course = require("./models/Course"); // Make sure this matches your file name 'Course.js'


// Import Routes (Ensure these paths are correct relative to server.js)
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses'); // Correctly importing your courses router!
const contactRoutes = require('./routes/Contact');
const staffRoutes = require('./routes/Staff');
const eventsRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');

// Create an Express application instance
const app = express();

// Middleware
app.use(express.json()); // Allows the server to parse JSON bodies from incoming requests
app.use(cors()); // Enable CORS for all routes

// Database Connection
const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---

// Basic Root Route (for testing if the server is running)
app.get("/", (req, res) => {
  res.send("University Backend API is running!");
});

// --- USE ROUTERS HERE ---
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/courses', courseRoutes); // <--- NEW: Using your dedicated courses router!
app.use('/api/contact', contactRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/student-auth', require('./routes/studentAuth'));
app.use('/api/students', require('./routes/students')); 

// --- Contact Message Routes (These are still defined directly in server.js, consider moving to ./routes/contact.js later) ---

// Setup Nodemailer transporter (replace with your actual email service details)
// This example uses Gmail. For production, consider SendGrid, Mailgun, etc.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Your Gmail app password (NOT your regular password)
  },
});

// POST route for contact form submission
app.post("/api/contact", async (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // 1. Save message to MongoDB
    const newContactMessage = new ContactMessage({
      fullName,
      email,
      message,
    });
    await newContactMessage.save();

    // 2. Send email notification (optional but recommended)
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email or your own email
      subject: `New Contact Form Submission from ${fullName}`,
      html: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${fullName} (${email})`);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    // Differentiate error types if possible
    if (err.name === "ValidationError") {
      res.status(400).json({ message: err.message });
    } else if (err.code === "EENVELOPE" || err.code === "EAUTH") {
      res
        .status(500)
        .json({ message: "Failed to send email. Check server configuration." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

// --- Staff Routes (These are still defined directly in server.js, consider moving to ./routes/staff.js later) ---

// GET all staff members
app.get("/api/staff", async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a new staff member (requires valid JSON body)
app.post("/api/staff", async (req, res) => {
  const staffMember = new Staff({
    name: req.body.name,
    title: req.body.title,
    imageURL: req.body.imageURL,
  });

  try {
    const newStaffMember = await staffMember.save();
    res.status(201).json(newStaffMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Calendar Items Route (for /api/calendar-items) ---

app.get("/api/calendar-items", async (req, res) => {
  try {
    // Fetch news items, projecting only date, slug, and adding a 'type'
    const newsItems = await News.find({}, "date slug").lean(); // .lean() for plain JS objects
    const formattedNews = newsItems.map((item) => ({
      date: item.date.toISOString().split("T")[0], // Format to YYYY-MM-DD
      slug: item.slug,
      type: "news",
    }));

    // Fetch event items, projecting only date, slug, and adding a 'type'
    const eventItems = await Event.find({}, "date slug").lean(); // Assuming Event also has a slug
    const formattedEvents = eventItems.map((item) => ({
      date: item.date.toISOString().split("T")[0], // Format to YYYY-MM-DD
      slug: item.slug,
      type: "events",
    }));

    // Combine and send back
    const allCalendarItems = [...formattedNews, ...formattedEvents];
    res.json(allCalendarItems);
  } catch (err) {
    console.error("Error fetching calendar items:", err);
    res.status(500).json({ message: "Failed to fetch calendar data." });
  }
});

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});