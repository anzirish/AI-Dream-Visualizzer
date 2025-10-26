import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware to prevent abuse
 * Limits requests per IP address within a time window
 */
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (only count errors and failed attempts)
  skipSuccessfulRequests: false,
  // Skip failed requests (only count successful requests)
  skipFailedRequests: false,
});

/**
 * Stricter rate limiting for authentication endpoints
 * Prevents brute force attacks on login/signup
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only count failed authentication attempts
  skipSuccessfulRequests: true,
});