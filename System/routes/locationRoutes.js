const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const Product = require('../models/productModel');
const locationController = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// Create a new location - Protected route
router.post('/locations', locationController.createLocation);  // Only authenticated users can create locations

// Get all locations - Public route (optional: protect this route if needed)
router.get('/locations', locationController.getAllLocations);  // This can be public or protected based on your needs

// Get products by location - Public route (optional: protect this route if needed)
router.get('/products/location/:locationId', async (req, res) => {
  try {
    const products = await Product.find({ location: req.params.locationId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;