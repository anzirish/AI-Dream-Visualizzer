import express from "express";
import { ApiKey } from "../../models/ApiKey";
import { authenticate, AuthenticatedRequest } from "../../middleware/auth";

const router = express.Router();

/**
 * Add new API key
 * POST /api/v1/api-keys
 */
router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { keyType, apiKey } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!keyType || !apiKey) {
      return res.status(400).json({
        success: false,
        message: "Key type and API key are required"
      });
    }

    if (!['openrouter', 'stable_diffusion'].includes(keyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid key type"
      });
    }

    // Check if key already exists
    const existingKey = await ApiKey.findOne({ apiKey });
    if (existingKey) {
      return res.status(400).json({
        success: false,
        message: "This API key is already registered"
      });
    }

    // Create new API key
    const newApiKey = new ApiKey({
      keyType,
      apiKey,
      contributedBy: userId
    });

    await newApiKey.save();

    res.status(201).json({
      success: true,
      message: "API key added successfully",
      data: {
        id: newApiKey._id,
        keyType: newApiKey.keyType,
        createdAt: newApiKey.createdAt
      }
    });

  } catch (error) {
    console.error("Error adding API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add API key"
    });
  }
});

/**
 * Get user's contributed API keys
 * GET /api/v1/api-keys/my
 */
router.get("/my", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const apiKeys = await ApiKey.find({ contributedBy: userId })
      .select('keyType usageCount isActive createdAt lastUsedAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { apiKeys }
    });

  } catch (error) {
    console.error("Error fetching user API keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch API keys"
    });
  }
});

/**
 * Get API key statistics
 * GET /api/v1/api-keys/stats
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await ApiKey.aggregate([
      {
        $group: {
          _id: "$keyType",
          totalKeys: { $sum: 1 },
          activeKeys: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] }
          },
          totalUsage: { $sum: "$usageCount" }
        }
      }
    ]);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error("Error fetching API key stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
});

/**
 * Delete user's API key
 * DELETE /api/v1/api-keys/:id
 */
router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const apiKey = await ApiKey.findOneAndDelete({
      _id: id,
      contributedBy: userId
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API key not found"
      });
    }

    res.json({
      success: true,
      message: "API key deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting API key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete API key"
    });
  }
});

export default router;