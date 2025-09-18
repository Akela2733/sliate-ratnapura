// server/routes/staff.js
const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const auth = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const admin = require("../middleware/adminMiddleware"); // Assuming you have an admin middleware

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Public
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find().sort({ name: 1 }); // Sort by name alphabetically
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/staff/:id
// @desc    Get single staff member by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/staff
// @desc    Add a new staff member
// @access  Private (Admin only)
router.post("/", [auth, admin], async (req, res) => {
  try {
    const {
      name,
      title,
      department,
      email,
      phone,
      imageURL,
      description,
      linkedinProfile,
    } = req.body;

    const newStaff = new Staff({
      name,
      title,
      department,
      email,
      phone,
      imageURL,
      description,
      linkedinProfile,
    });

    const staff = await newStaff.save();
    res
      .status(201)
      .json({ message: "Staff member added successfully!", data: staff });
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/staff/:id
// @desc    Update a staff member
// @access  Private (Admin only)
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const {
      name,
      title,
      department,
      email,
      phone,
      imageURL,
      description,
      linkedinProfile,
    } = req.body;

    const staffFields = {
      name,
      title,
      department,
      email,
      phone,
      imageURL,
      description,
      linkedinProfile,
    };

    let staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true, runValidators: true } // runValidators ensures schema validation on update
    );

    res.json({ message: "Staff member updated successfully!", data: staff });
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/staff/:id
// @desc    Delete a staff member
// @access  Private (Admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member removed successfully!" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
