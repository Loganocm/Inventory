const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (password) {
      user.password = password;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    
    await user.save();
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};