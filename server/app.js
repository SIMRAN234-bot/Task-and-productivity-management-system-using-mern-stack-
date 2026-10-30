const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ==========================================
// Middlewares
// ==========================================

// HTTP request logger in development mode
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development mode, allow any local port (e.g. if Vite binds to 5174, 5175, etc.)
      if (process.env.NODE_ENV !== 'production') {
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
      }

      // Disallow origin cleanly without crashing the server
      console.warn(`⚠️ [CORS Warning] Request blocked from origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Database connection health check middleware for API routes
const checkDatabaseReadiness = (req, res, next) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    console.error(`\n❌ [Database Unavailable] ${req.method} ${req.originalUrl}`);
    console.error(`MongoDB is not connected (readyState: ${mongoose.connection.readyState}).`);
    console.error(`Please check server/.env configuration or database logs.\n`);

    return res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please verify that the MongoDB service is running and configured.',
    });
  }
  next();
};

// ==========================================
// API Endpoints
// ==========================================

// Health check endpoint (always accessible even when DB is connecting)
app.get('/api/health', (req, res) => {
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'TaskFlow API Server',
  });
});

// Root greeting
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TaskFlow REST API. Access endpoints via /api/...',
    health: '/api/health',
  });
});

// Primary application routes protected by database readiness check
app.use('/api/auth', checkDatabaseReadiness, authRoutes);
app.use('/api/tasks', checkDatabaseReadiness, taskRoutes);
app.use('/api/users', checkDatabaseReadiness, userRoutes);
app.use('/api/notifications', checkDatabaseReadiness, notificationRoutes);

// ==========================================
// Error Handling
// ==========================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
