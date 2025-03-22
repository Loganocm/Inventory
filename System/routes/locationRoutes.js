const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
const Product = require('../models/productModel');
const locationController = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

// Protected route
router.post('/locations', locationController.createLocation);

// Public routes
router.get('/locations', locationController.getAllLocations);
router.get('/products/location/:locationId', async (req, res) => {
  try {
    const products = await Product.find({ location: req.params.locationId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;