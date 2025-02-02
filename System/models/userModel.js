const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure the username is unique
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address'], // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 2, // Ensure password length is reasonable
    },
    // Optionally, you can add more fields like role, account status, etc.
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Only hash if the password is modified
  }
  try {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare the input password with the stored hashed password
};

// Create the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;