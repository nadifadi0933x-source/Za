const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000,
    max: max || 100,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const authLimiter = createRateLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts, please try again after 15 minutes');
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again after 15 minutes');
const uploadLimiter = createRateLimiter(60 * 1000, 10, 'Too many upload requests, please try again later');

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
};
