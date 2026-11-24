require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health / Root Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'code-a-nova-api' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/hackathon', hackathonRoutes);

// Start Server Immediately so Render Detects Open Port
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/code-a-nova';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });