require("dotenv").config();  
const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require("./config/db");
const productRoutes = require('./routes/productRoutes');
const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const locationController = require('./controllers/locationController');  // Fix path here
const app = express();
const path = require('path');

// Middleware
app.use(cors()); // Handle CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // Log requests
app.use(express.json()); // Parse JSON requests

const allowedHosts = ['mysterious-temple-00069-c05b7bb6cec2.herokuapp.com', 'localhost'];

app.use((req, res, next) => {
  const host = req.headers.host.split(':')[0]; // Ignore port numbers
  if (!allowedHosts.includes(host)) {
    return res.status(400).send('Invalid Host');
  }
  next();
});

// Connect to Database & ensure default location exists after connection
connectDB().then(() => {
  locationController.createDefaultLocation();
});

// Routes
app.use("/api/auth", authRoutes); // Login/Register routes (No protection needed)
app.use("/api/users", userRoutes); // User-related routes (Protected)
app.use("/api", productRoutes); // Product-related routes (Protected)
app.use("/api", locationRoutes); // Location-related routes (Protected)

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// All other routes will be handled by React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));