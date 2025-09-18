// server/routes/subjects.js
const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const auth = require("../middleware/authMiddleware"); // Assumens authMiddleware tuum
const admin = require("../middleware/adminMiddleware"); // Assumens adminMiddleware tuum

// @route   GET /api/subjects
// @desc    Get all subjects (optionally filter by department)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.department) {
      query.department = req.query.department.toUpperCase(); // Fac ut department sit uppercase
    }
    const subjects = await Subject.find(query).sort({ name: 1 }); // Ordina per nomen
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/subjects
// @desc    Add a new subject
// @access  Private (Admin only)
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { name, code, department, description } = req.body;

    // Comproba si subiectum cum eodem codice iam existit
    let existingSubject = await Subject.findOne({ code: code.toUpperCase() });
    if (existingSubject) {
      return res.status(400).json({ message: "Subject with this code already exists." });
    }

    const newSubject = new Subject({
      name,
      code: code.toUpperCase(), // Serva codicem uppercase
      department: department.toUpperCase(), // Serva department uppercase
      description
    });

    const subject = await newSubject.save();
    res.status(201).json({ message: "Subject added successfully!", data: subject });
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update a subject
// @access  Private (Admin only)
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const { name, code, department, description } = req.body;

    const subjectFields = {
      name,
      code: code ? code.toUpperCase() : undefined, // Serva codicem uppercase si praebetur
      department: department ? department.toUpperCase() : undefined, // Serva department uppercase si praebetur
      description
    };

    // Comproba si subiectum cum eodem codice iam existit, praeter ipsum subiectum quod emendatur
    if (subjectFields.code) {
      const existingSubject = await Subject.findOne({ code: subjectFields.code, _id: { $ne: req.params.id } });
      if (existingSubject) {
        return res.status(400).json({ message: "Subject with this code already exists." });
      }
    }

    let subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: subjectFields },
      { new: true, runValidators: true } // runValidators efficit validationem schematis in renovatione
    );

    res.json({ message: "Subject updated successfully!", data: subject });
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject
// @access  Private (Admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject removed successfully!" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
