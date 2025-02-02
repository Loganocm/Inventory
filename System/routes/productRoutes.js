const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductsByLocation, getAllProductsFromAllLocations } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware'); // Correctly importing protect

// Create a new product - Protected route
router.post('/products', protect, createProduct);  // Only authenticated users can create products

// Get all products - Public route (no protection)
router.get('/products', getAllProducts);  // Public route to get all products

// Update a product - Protected route
router.put('/products/:id', protect, updateProduct);  // Only authenticated users can update products

// Delete a product - Protected route
router.delete('/products/:id', protect, deleteProduct);  // Only authenticated users can delete products

// Get all products for a specific location - Public route (optional: protect this route if needed)
router.get('/products/location/:location', getProductsByLocation);  // Public route to get products by location

// Get all products from all locations - Public route (optional: protect this route if needed)
router.get('/products/all-locations', getAllProductsFromAllLocations);  // Public route to get all products from all locations

module.exports = router;