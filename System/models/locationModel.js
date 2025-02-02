const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // Ensures no duplicate locations
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Location', locationSchema);