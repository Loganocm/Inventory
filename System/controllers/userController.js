const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User Registration
exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password, // Password will be automatically hashed due to pre-save hook
    });

    // Save the user to the database
    await newUser.save();

    // Send a response excluding the password field
    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send token as a response
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

// Get User Information (only for logged-in users)
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated via token middleware

    // Find user by ID and exclude password in the response
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

// Update User Information
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated via token middleware
    const { username, email, password } = req.body;

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash password if it's being updated
    if (password) {
      user.password = password; // The password will be automatically hashed on save due to pre-save hook
    }

    user.username = username || user.username;
    user.email = email || user.email;

    // Save updated user info
    await user.save();

    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated via token middleware

    // Find and delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};