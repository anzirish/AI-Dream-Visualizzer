import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/config/database";
import { errorHandler } from "./src/middleware/errorHandler";
import { rateLimiter } from "./src/middleware/rateLimiter";

// Import routes
import v1Routes from "./src/routes/v1";
import { apiDocumentation } from "./src/config/apiDocs";

// Load environment variables from .env file
dotenv.config();

// Express application instance
const app = express();

// Server port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Initialize database connection
connectDB();

// Security Middleware Configuration
// - Helmet: Sets various HTTP headers for security
// - CORS: Enables cross-origin requests from frontend
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Logging Middleware
// Morgan logs HTTP requests in combined format for monitoring
app.use(morgan("combined"));

// Rate Limiting Middleware
// Prevents abuse by limiting requests per IP address
app.use(rateLimiter);

// Body Parsing Middleware
// - JSON parser with 10MB limit for image uploads
// - URL-encoded parser for form data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint - GET /health
// Provides server status information for monitoring and load balancers
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI Dreams API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: "development",
  });
});

// API Route Configuration
app.use("/api/v1", v1Routes);

// API Documentation Endpoint - GET /api
// Returns comprehensive API documentation including all available endpoints
app.get("/api", (req, res) => {
  res.status(200).json(apiDocumentation);
});

// 404 Not Found Handler
// Catches all unmatched routes and returns a helpful error message
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    suggestion: "Visit /api for available endpoints",
  });
});

// Global Error Handler
// Centralized error handling middleware that processes all application errors
app.use(errorHandler);

// Start the Express Server
// Binds the application to the specified port and begins listening for requests
app.listen(PORT, () => {
  console.log(`🚀 AI Dreams API Server running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🔗 API v1: http://localhost:${PORT}/api/v1`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

// Export for testing and external use
export default app;
