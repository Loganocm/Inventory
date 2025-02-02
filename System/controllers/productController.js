const Product = require('../models/productModel');
const Location = require('../models/locationModel'); // Import Location model

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, quantity, location } = req.body;

    // Ensure location exists in the database
    const validLocation = await Location.findById(location);
    if (!validLocation) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const product = new Product({ name, price, category, quantity, location });
    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // Get all products and populate the location field with the location's name
    const products = await Product.find().populate('location', 'name'); 
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByLocation = async (req, res) => {
  try {
    // Get products by location and populate the location field with the location's name
    const products = await Product.find({ location: req.params.location }).populate('location', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProductsFromAllLocations = async (req, res) => {
  try {
    // Get all products and populate the location field with the location's name
    const products = await Product.find().populate('location', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, quantity, location } = req.body;
    const productId = req.params.id;

    // Ensure location exists in the database
    const validLocation = await Location.findById(location);
    if (!validLocation) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, category, quantity, location },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};