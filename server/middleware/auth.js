const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_production';

const { getStatus } = require('../config/db');

// Protect middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_MISSING',
      message: 'Authentication required. Please sign in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { isConnected } = getStatus();
    
    let user = null;
    if (isConnected) {
      try {
        user = await User.findById(decoded.id).select('-passwordHash');
      } catch (dbErr) {
        user = null;
      }
    }

    if (!user) {
      const { findUserById } = require('../services/inMemoryStore');
      user = findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'Your session has expired. Please sign in again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_INVALID',
      message: 'Your session has expired. Please sign in again.',
    });
  }
};

// Optional protect middleware (attaches user if token is present, does not fail if not)
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { isConnected } = getStatus();
    let user = null;
    if (isConnected) {
      try {
        user = await User.findById(decoded.id).select('-passwordHash');
      } catch (e) {
        user = null;
      }
    }
    if (!user) {
      const { findUserById } = require('../services/inMemoryStore');
      user = findUserById(decoded.id);
    }
    req.user = user;
  } catch (error) {
    req.user = null;
  }
  next();
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorize,
  JWT_SECRET,
};
