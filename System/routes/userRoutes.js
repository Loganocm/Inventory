const express = require('express');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');  // Import 'protect'
const router = express.Router();

// Get User Profile (Protected)
router.get('/profile', protect, async (req, res) => {
  try {
    // Get the user ID from the token (stored in req.user after verification)
    const userId = req.user.id; // Updated to match how req.user is set in authMiddleware

    // Fetch user details excluding the password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile data
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile (Protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the decoded token
    const { username, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile data
    if (password) {
      // Hash password if it's being updated
      user.password = password; // The pre-save hook will hash the password before saving
    }
    user.username = username || user.username;
    user.email = email || user.email;

    // Save the updated user info
    await user.save();

    // Return the updated user data (excluding password)
    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;