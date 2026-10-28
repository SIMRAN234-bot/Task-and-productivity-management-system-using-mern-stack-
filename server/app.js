const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

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
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ==========================================
// API Endpoints
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'TaskFlow API Server',
  });
});

// Primary application routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TaskFlow REST API. Access endpoints via /api/...',
    docs: '/api/health',
  });
});

// ==========================================
// Error Handling
// ==========================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
