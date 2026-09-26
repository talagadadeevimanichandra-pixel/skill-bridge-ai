/**
 * SkillBridge AI — Production Rate Limiting Middleware
 * In-memory sliding window rate limiter to protect endpoints from abuse and DoS.
 */

const createRateLimiter = ({ windowMs = 60 * 1000, max = 100, message = 'Too many requests. Please slow down.' }) => {
  const requests = new Map(); // key -> [timestamps]

  // Periodic cleanup of stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests.entries()) {
      const valid = timestamps.filter(t => now - t < windowMs);
      if (valid.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, valid);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    // Generate identifier: User ID if authenticated, else IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const key = req.user ? `user_${req.user._id}` : `ip_${ip}`;

    const now = Date.now();
    const timestamps = requests.get(key) || [];
    const recentTimestamps = timestamps.filter(t => now - t < windowMs);

    if (recentTimestamps.length >= max) {
      const oldest = recentTimestamps[0];
      const resetTimeSec = Math.ceil((windowMs - (now - oldest)) / 1000);

      res.setHeader('Retry-After', resetTimeSec);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((oldest + windowMs) / 1000));

      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetTimeSec,
      });
    }

    recentTimestamps.push(now);
    requests.set(key, recentTimestamps);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recentTimestamps.length));

    next();
  };
};

// 1. Auth Limiter (Login, Register): 100 requests per 15 minutes
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

// 2. AI Limiter (Interview prep, Career assistant, Skill gap, Match): 40 requests per minute
const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 40,
  message: 'AI request limit reached. Please wait a moment before sending more requests.',
});

// 3. General API Limiter: 200 requests per minute
const generalLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many API requests. Please slow down.',
});

module.exports = {
  createRateLimiter,
  authLimiter,
  aiLimiter,
  generalLimiter,
};
