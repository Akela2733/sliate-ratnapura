// server/models/Subject.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Subject name cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Please add a subject code'],
    unique: true,
    trim: true,
    maxlength: [20, 'Subject code cannot be more than 20 characters']
  },
  department: {
    type: String,
    required: [true, 'Please specify the department this subject belongs to'],
    enum: ['HNDE', 'HNDA', 'HNDIT'] // Must match departments in StudentSchema
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  // Can reference courses if subjects are part of a specific course
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Course' // Referencing 'Course' model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// IMPORTANT: Check if the model already exists before compiling it.
// This prevents OverwriteModelError if the file is required multiple times.
module.exports = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
