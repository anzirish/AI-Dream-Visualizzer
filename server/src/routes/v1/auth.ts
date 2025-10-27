import { Router } from "express";
import { signup, login, getMe, logout } from "../../controllers/authController";
import { authenticate } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";

/** Express router instance for authentication endpoints */
const router = Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", rateLimiter, signup);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", rateLimiter, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", authenticate, getMe);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, logout);

export default router;
