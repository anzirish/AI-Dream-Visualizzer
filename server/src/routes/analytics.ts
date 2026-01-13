import { Router } from "express";
import { authenticate } from "../middleware/auth";
import Dream from "../models/Dream";
import User from "../models/User";
import { ApiError } from "../middleware/errorHandler";

// Express router instance for analytics endpoints
const router = Router();

// @route   GET /api/analytics/overview
// @desc    Get platform overview statistics
// @access  Public
router.get("/overview", async (req, res, next) => {
  try {
    const [totalUsers, totalDreams, publicDreams] = await Promise.all([
      User.countDocuments(),
      Dream.countDocuments(),
      Dream.countDocuments({ isPublic: true }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        platform: {
          totalUsers,
          totalDreams,
          publicDreams,
          privateDreams: totalDreams - publicDreams,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/user/stats
// @desc    Get current user's dream statistics
// @access  Private
router.get("/user/stats", authenticate, async (req, res, next) => {
  try {
    const userId = (req as { user?: { userId: string } }).user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const [totalDreams, publicDreams, recentDreams] = await Promise.all([
      Dream.countDocuments({ userId }),
      Dream.countDocuments({ userId, isPublic: true }),
      Dream.countDocuments({
        userId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      }),
    ]);

    // Get dream creation trend (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dreamTrend = await Dream.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: {
          totalDreams,
          publicDreams,
          privateDreams: totalDreams - publicDreams,
          recentDreams, // Last 30 days
          dreamTrend, // Last 7 days daily breakdown
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/trends
// @desc    Get platform trends and popular content
// @access  Public
router.get("/trends", async (req, res, next) => {
  try {
    // Get most active users (by public dream count)
    const topCreators = await Dream.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userName" },
          dreamCount: { $sum: 1 },
        },
      },
      { $sort: { dreamCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: 1,
          dreamCount: 1,
        },
      },
    ]);

    // Get recent activity (dreams created in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await Dream.countDocuments({
      isPublic: true,
      createdAt: { $gte: oneDayAgo },
    });

    // Get weekly growth
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [thisWeekDreams, thisWeekUsers] = await Promise.all([
      Dream.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        trends: {
          topCreators,
          recentActivity, // Dreams in last 24h
          weeklyGrowth: {
            newDreams: thisWeekDreams,
            newUsers: thisWeekUsers,
          },
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analytics/health
// @desc    Analytics API health check
// @access  Public
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Analytics API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
