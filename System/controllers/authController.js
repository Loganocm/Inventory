const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username and email are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user
    user = new User({
      username,
      email,
      password, // Password will be hashed by Mongoose middleware
    });

    await user.save();

    // Create a JWT token
    const payload = {
      userId: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, username: user.username });

  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const payload = {
      userId: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username });

  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the logged-in user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // Get the userId from the request user object
    const userId = req.user.userId;

    // Fetch the user from the database, excluding the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in getUserProfile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the user's profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userId = req.user.userId;

    let updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10); // Hash new password
    if (role) updatedFields.role = role;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error in updateUserProfile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};