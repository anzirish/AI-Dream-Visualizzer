import { Router } from "express";
import authRoutes from "./auth";
import dreamRoutes from "./dreams";
import aiRoutes from "./ai";

// Express router instance for v1 API endpoints
const router = Router();

router.use("/auth", authRoutes);
router.use("/dreams", dreamRoutes);
router.use("/ai", aiRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Dreams API v1 is running",
    version: "1.1.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;
