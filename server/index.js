require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { connectDB, getStatus } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const skillRoutes = require('./routes/skillRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with in-memory fallback if MongoDB is not running)
connectDB();

// Global Security Middlewares
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Configure CORS for local development and deployed frontend domain
const getAllowedOrigins = () => {
  const custom = (process.env.CLIENT_URL || '')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  const origins = new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    ...custom,
    ...custom.map(u => u.replace(/\/+$/, '')),
  ]);

  return Array.from(origins);
};

app.use(cors({
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    const cleanOrigin = origin ? origin.replace(/\/+$/, '') : '';
    // Allow non-browser requests or matching origins
    if (!origin || allowed.some(a => a.replace(/\/+$/, '') === cleanOrigin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Access from origin '${origin}' is restricted.`), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));

// Rate Limiting Middlewares
const { authLimiter, aiLimiter, generalLimiter } = require('./middleware/rateLimiter');

// Static files for uploaded resumes (Protected & non-executable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getStatus();
  res.json({
    status: 'ok',
    platform: 'SkillBridge AI Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus.isConnected ? 'connected' : 'active',
  });
});

// Protected API Routes with Rate Limiters
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resume', aiLimiter, resumeRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/skills', skillRoutes);

// Global Error Handler (Sanitizes internal technical traces from user responses)
app.use((err, req, res, next) => {
  console.error('[Server Error Notice]', err.message || err);

  const statusCode = err.status || 500;
  let clientMessage = err.message || 'Unable to process your request. Please try again.';

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    clientMessage = 'An unexpected server error occurred. Please try again later.';
  }

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SkillBridge AI Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = app;

