import { Router } from "express";
import authRoutes from "./auth";
import dreamRoutes from "./dreams";
import aiRoutes from "./ai";

/** Express router instance for v1 API endpoints */
const router = Router();

/**
 * API v1 Route Configuration
 *
 * Mounts feature-specific route modules under their respective paths.
 * Base path: /api/v1
 *
 * Available endpoints:
 * - /api/v1/auth - User authentication and account management
 * - /api/v1/dreams - Dream CRUD operations and community features
 * - /api/v1/ai - AI content generation services
 * - /api/v1/health - API health check endpoint
 */

/** Authentication and user management routes */
router.use("/auth", authRoutes);

/** Dream creation, retrieval, and management routes */
router.use("/dreams", dreamRoutes);

/** AI content generation service routes */
router.use("/ai", aiRoutes);

/**
 * API v1 Health Check Endpoint
 *
 * Provides health status specifically for the v1 API endpoints.
 * Used for monitoring and service discovery.
 *
 * @route GET /api/v1/health
 * @access Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Dreams API v1 is running",
    version: "1.1.0",
    timestamp: new Date().toISOString(),
  });
});

/** Export configured v1 router for use in main application */
export default router;
