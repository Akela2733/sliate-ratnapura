// server/models/Student.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Define regex patterns for each department's registration number format
const regNumPatterns = {
  HNDE: /^RAT\/EN\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/EN/2021/F/0000
  HNDA: /^RAT\/AC\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/AC/2022/F/0000
  HNDIT: /^RAT\/IT\/\d{4}\/[A-Z]\/\d{4}$/, // Example: RAT/IT/2022/F/0020
};

const StudentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Please add a registration number'],
    unique: true,
    trim: true,
    maxlength: [20, 'Registration number cannot be more than 20 characters'],
    // Custom validator for registration number format based on department
    validate: {
      validator: function(v) {
        const department = this.department; // 'this' refers to the document being validated
        if (!department || !regNumPatterns[department]) {
          // If department is not set or not in our patterns, allow any format (or add a default error)
          return true; // Or return false for a generic error if department is missing
        }
        // Test the registration number against the specific pattern for its department
        return regNumPatterns[department].test(v.toUpperCase());
      },
      message: props => `Invalid registration number format for ${props.value}. Expected format for ${props.path.department} department is ${regNumPatterns[props.path.department]?.source || 'unknown'}.`
    }
  },
  name: {
    type: String,
    required: [true, 'Please add a student name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ],
    unique: true,
    sparse: true // Allows null values for unique fields
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Does not return the password in queries
  },
  department: {
    type: String,
    required: [true, 'Please specify the student\'s department'],
    enum: ['HNDE', 'HNDA', 'HNDIT'], // Define allowed departments
    default: 'HNDIT' // Default department if not specified
  },
  enrolledSubjects: [ // Array of Object IDs referencing Subject model
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject' // Referencing to 'Subject' model
    }
  ],
  role: {
    type: String,
    enum: ['student'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
StudentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// IMPORTANT: Check if the model already exists before compiling it.
module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema);
