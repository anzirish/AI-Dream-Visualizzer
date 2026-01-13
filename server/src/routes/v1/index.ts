import { Router } from "express";
import authRoutes from "./auth";
import dreamRoutes from "./dreams";
import aiRoutes from "./ai";

// Express router instance for v1 API endpoints
const router = Router();

// API v1 Route Configuration - Mounts feature-specific route modules under their respective paths

// Authentication and user management routes
router.use("/auth", authRoutes);

// Dream creation, retrieval, and management routes
router.use("/dreams", dreamRoutes);

// AI content generation service routes
router.use("/ai", aiRoutes);

// API v1 Health Check Endpoint - Provides health status specifically for the v1 API endpoints
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Dreams API v1 is running",
    version: "1.1.0",
    timestamp: new Date().toISOString(),
  });
});

// Export configured v1 router for use in main application
export default router;
