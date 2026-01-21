const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const animeRoutes = require('./src/routes/animeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // All auth routes start with /api/auth
app.use('/api/anime', animeRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Animend API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
