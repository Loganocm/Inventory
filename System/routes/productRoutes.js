const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductsByLocation, getAllProductsFromAllLocations } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

//Public routes
router.get('/products', getAllProducts);
router.get('/products/location/:location', getProductsByLocation);
router.get('/products/all-locations', getAllProductsFromAllLocations);

//Protected routes
router.post('/products', protect, createProduct);
router.put('/products/:id', protect, updateProduct);
router.delete('/products/:id', protect, deleteProduct);

module.exports = router;