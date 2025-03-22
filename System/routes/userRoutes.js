const express = require('express');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (password) {
      user.password = password;
    }
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

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