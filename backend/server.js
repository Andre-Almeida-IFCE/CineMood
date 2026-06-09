const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const favoriteRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for credentials if needed
app.use(cors({
  origin: '*', // For development flexibility
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({
    message: 'Erro interno no servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Export app for Vercel (serverless)
module.exports = app;

// Start listening only when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🎬 CineMood Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
    console.log(`===============================================`);
  });
}
