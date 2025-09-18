const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true, // e.g., "HNDIT", "HNDA", "HNDE"
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true // e.g., "HNDIT – Information Technology"
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        default: '' // Path to the course image
    },
    labelColor: {
        type: String,
        default: 'bg-gray-700' // Tailwind CSS class string, e.g., "bg-blue-700"
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Course', CourseSchema);