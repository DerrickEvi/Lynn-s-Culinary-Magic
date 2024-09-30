require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3 // limit each IP to 3 password reset attempts per hour
});

app.use('/api/', apiLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu-items', menuItemRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

// Define port
const PORT = process.env.PORT || 5020;

if (process.env.NODE_ENV === 'production') {
  // HTTPS server for production
  const httpsOptions = {
    key: fs.readFileSync('/path/to/your/private/key.pem'),
    cert: fs.readFileSync('/path/to/your/certificate.pem')
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  // HTTP server for development
  app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));
}

module.exports = app;