// server/models/Staff.js
const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a staff member name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Please add a title (e.g., Lecturer, Professor, Admin Officer)'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department cannot be more than 100 characters'],
    default: 'General' // Default department if not specified
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ],
    unique: true, // Email should ideally be unique
    sparse: true // Allows null values for unique fields
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  imageURL: {
    type: String,
    required: [true, 'Please add an image URL for the staff member'],
    default: 'https://via.placeholder.com/150' // Default placeholder image
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  linkedinProfile: {
    type: String,
    match: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
      'Please use a valid LinkedIn URL'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', StaffSchema);