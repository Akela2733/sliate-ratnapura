// server/routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student"); // Import the Student model
const auth = require("../middleware/authMiddleware"); // Import auth middleware (for admin routes)
const admin = require("../middleware/adminMiddleware"); // Import admin middleware (for admin routes)
const studentAuthMiddleware = require("../middleware/studentAuthMiddleware"); // Import studentAuthMiddleware

// @route   GET /api/students/me
// @desc    Get current logged-in student's profile and enrolled subjects
// @access  Private (Student only)
// IMPORTANT: This specific route MUST come BEFORE /api/students/:id
router.get("/me", studentAuthMiddleware, async (req, res) => {
  try {
    // req.user.id is now set by the studentAuthMiddleware
    const student = await Student.findById(req.user.id) // Changed from req.student.id to req.user.id
      .select('-password') // Exclude password from the response
      .populate({
        path: 'enrolledSubjects',
        select: 'name code department' // Populate subject details
      });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found." });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID (for admin view)
// @access  Private (Admin only)
// This route is more general and comes AFTER /me
router.get("/:id", [auth, admin], async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'enrolledSubjects',
        select: 'name code department'
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") { // Handle invalid ID format
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/students
// @desc    Get all students (for admin view)
// @access  Private (Admin only)
router.get("/", [auth, admin], async (req, res) => {
  try {
    const query = {};
    if (req.query.studentId) {
      query.student = req.query.studentId;
    }
    if (req.query.subjectId) {
      query.subject = req.query.subjectId;
    }
    if (req.query.year) {
      query.year = parseInt(req.query.year);
    }
    if (req.query.semester) {
      query.semester = parseInt(req.query.semester);
    }

    const students = await Student.find(query)
      .select('-password') // Don't send password hash
      .populate({
        path: 'enrolledSubjects',
        select: 'name code department' // Populate subject details
      })
      .sort({ registrationNumber: 1 }); // Sort by registration number

    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   POST /api/students
// @desc    Create a new student (by admin)
// @access  Private (Admin only)
router.post("/", [auth, admin], async (req, res) => {
  const { registrationNumber, name, email, password, department, enrolledSubjects } = req.body;

  try {
    // Check if registration number already exists
    let student = await Student.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (student) {
      return res.status(400).json({ message: "Student with this registration number already exists." });
    }

    // Check if email already exists (if provided and unique)
    if (email) {
      let existingEmailStudent = await Student.findOne({ email });
      if (existingEmailStudent) {
        return res.status(400).json({ message: "Student with this email already exists." });
      }
    }

    // Create new student instance
    student = new Student({
      registrationNumber: registrationNumber.toUpperCase(),
      name,
      email,
      password, // Password will be hashed by pre-save hook in Student model
      department: department.toUpperCase(),
      enrolledSubjects: enrolledSubjects || [], // Assign subjects if provided
      role: 'student' // Ensure role is 'student'
    });

    await student.save(); // Save the student to the database

    // Respond with the created student (excluding password)
    res.status(201).json({ message: "Student created successfully!", data: student.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } }) });

  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") { // Handle Mongoose validation errors
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    } else if (err.code === 11000) { // Duplicate key error from unique index
      return res.status(400).json({ message: "Duplicate student entry (registration number or email)." });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student's details (by admin)
// @access  Private (Admin only)
router.put("/:id", [auth, admin], async (req, res) => {
  const { registrationNumber, name, email, password, department, enrolledSubjects } = req.body;

  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if updated registration number already exists for another student
    if (registrationNumber && registrationNumber.toUpperCase() !== student.registrationNumber) {
      const existingStudent = await Student.findOne({ registrationNumber: registrationNumber.toUpperCase() });
      if (existingStudent && existingStudent._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Another student already uses this registration number." });
      }
    }

    // Check if updated email already exists for another student
    if (email && email !== student.email) {
      const existingEmailStudent = await Student.findOne({ email });
      if (existingEmailStudent && existingEmailStudent._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Another student already uses this email." });
      }
    }

    // Update fields
    student.registrationNumber = registrationNumber ? registrationNumber.toUpperCase() : student.registrationNumber;
    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department ? department.toUpperCase() : student.department;
    student.enrolledSubjects = enrolledSubjects || student.enrolledSubjects; // Update enrolled subjects

    // If password is provided, hash and update it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    await student.save(); // Save updated student

    // Respond with the updated student (excluding password)
    res.json({ message: "Student updated successfully!", data: student.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.password; return ret; } }) });

  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student (by admin)
// @access  Private (Admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student removed successfully!" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
