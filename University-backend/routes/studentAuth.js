// server/routes/studentAuth.js
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); // Ut secretum JWT accipias
const Student = require("../models/Student");
const studentAuthMiddleware = require("../middleware/studentAuthMiddleware"); // Novum middleware pro studentibus

// IMPORTANT: Fac ut 'config' npm package installatum sit et 'jwtSecret' in 'config/default.json' habeas.
// Si non habes, 'npm install config' et crea 'server/config/default.json':
// {
//   "jwtSecret": "your_jwt_secret_token_here",
//   "mongoURI": "your_mongo_db_uri_here"
// }

// @route   POST /api/student-auth/register
// @desc    Register a new student
// @access  Public (or Private, if only admin can register students)
// Nota: Pro vera universitate, registratio studentium per admin panel potius quam publica via fieri solet.
// Sed hic includitur ad demonstrationem si vis publicam registrationem.
router.post("/register", async (req, res) => {
  const { registrationNumber, name, email, password, department } = req.body;

  try {
    // Comproba si studentis numerus registrationis iam existit
    let student = await Student.findOne({ registrationNumber });
    if (student) {
      return res.status(400).json({ message: "Student with this registration number already exists." });
    }

    // Comproba si electronica iam existit (si electronica est unica et providetur)
    if (email) {
      let existingEmailStudent = await Student.findOne({ email });
      if (existingEmailStudent) {
        return res.status(400).json({ message: "Student with this email already exists." });
      }
    }

    // Crea novum studentem
    student = new Student({
      registrationNumber: registrationNumber.toUpperCase(), // Serva uppercase
      name,
      email,
      password, // Hashed in pre-save hook in model
      department: department.toUpperCase(), // Serva uppercase
      role: 'student' // Munus defaltum
    });

    await student.save();

    // Redde JWT (similis login)
    const payload = {
      student: {
        id: student.id,
        registrationNumber: student.registrationNumber,
        role: student.role
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1h' }, // Token expirabit post 1 horam
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ message: "Student registered successfully!", token, user: payload.student });
      }
    );
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/student-auth/login
// @desc    Authenticate student & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { registrationNumber, password } = req.body;

  try {
    // Comproba si studentis numerus registrationis existit
    let student = await Student.findOne({ registrationNumber: registrationNumber.toUpperCase() }).select('+password'); // Accipe tesseram

    if (!student) {
      return res.status(400).json({ message: "Invalid Credentials (Registration Number not found)." });
    }

    // Comproba tesseram
    const isMatch = await student.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials (Password incorrect)." });
    }

    // Redde JWT
    const payload = {
      student: {
        id: student.id,
        registrationNumber: student.registrationNumber,
        role: student.role
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ message: "Login successful!", token, user: payload.student });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/student-auth
// @desc    Get logged in student data (using studentAuthMiddleware)
// @access  Private (Student only)
router.get("/", studentAuthMiddleware, async (req, res) => {
  try {
    // req.student.id ex studentAuthMiddleware venit
    const student = await Student.findById(req.student.id).select('-password');
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
