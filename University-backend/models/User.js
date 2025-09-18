// university-backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/, // Basic email regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    // To differentiate between admin, editor, etc.
    type: String,
    enum: ["admin", "editor", "viewer"], // Define possible roles
    default: "viewer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true },
    labelColor: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    link: { type: String },
    // ADD THIS NEW SECTION:
    highlights: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        iconName: { type: String }, // e.g., "Check", "Users", "Briefcase" - must match a key in your frontend's iconMap
      },
    ],
  },
  { timestamps: true }
);



// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
