import { Router } from "express";
import { signup, login, getMe, logout } from "../../controllers/authController";
import { authenticate } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rateLimiter";

// Express router instance for authentication endpoints
const router = Router();

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;
