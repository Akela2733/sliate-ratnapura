const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true // Event date is crucial
    },
    location: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

// Pre-save hook to generate slug before saving
EventSchema.pre('validate', function(next) {
    if (this.title && this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    }
    next();
});

module.exports = mongoose.model('Event', EventSchema);