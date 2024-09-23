const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/menu-items", require("./routes/menuItemRoutes"));

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;