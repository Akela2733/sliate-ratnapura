const mongoose = require('mongoose');
const slugify = require('slugify'); // For generating URL-friendly slugs

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Remove whitespace from both ends
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Sets the current date/time when created
    },
    imageURL: {
        type: String,
        default: '' // Can be empty if no image
    },
    slug: {
        type: String,
        required: true,
        unique: true // Ensures no two news articles have the same slug
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Pre-save hook to generate slug before saving
NewsSchema.pre('validate', function(next) {
    if (this.title && this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    }
    next();
});

module.exports = mongoose.model('News', NewsSchema);