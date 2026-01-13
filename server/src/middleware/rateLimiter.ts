import rateLimit from "express-rate-limit";

// Rate Limiting Configuration
// Configures express-rate-limit middleware to limit the number of requests per IP address
export const rateLimiter = rateLimit({
  // Time window in milliseconds (15 minutes)
  windowMs: 15 * 60 * 1000,

  // Maximum number of requests per window per IP
  max: 100,

  // Standardized error response when limit is exceeded
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },

  // Additional configuration options:
  // - standardHeaders: true (adds RateLimit-* headers)
  // - legacyHeaders: false (disables X-RateLimit-* headers)
  // - skip: function to skip rate limiting for certain requests
  // - keyGenerator: function to customize how IPs are identified
});
