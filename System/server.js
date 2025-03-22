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
const locationController = require('./controllers/locationController');
const app = express();
const path = require('path');


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

const allowedHosts = ['mysterious-temple-00069-c05b7bb6cec2.herokuapp.com', 'localhost'];

app.use((req, res, next) => {
  const host = req.headers.host.split(':')[0];
  if (!allowedHosts.includes(host)) {
    return res.status(400).send('Invalid Host');
  }
  next();
});

connectDB().then(() => {
  locationController.createDefaultLocation();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", productRoutes);
app.use("/api", locationRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));