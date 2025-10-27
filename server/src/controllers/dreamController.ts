import { Response, NextFunction } from "express";
import Dream from "../models/Dream";
import User from "../models/User";
import { ApiError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";

/**
 * Create New Dream Handler
 *
 * Creates a new dream entry with AI-generated content and user metadata.
 * Validates required fields and associates dream with authenticated user.
 *
 * @route POST /api/v1/dreams
 * @access Private (requires authentication)
 *
 * @param req - Authenticated request with dream data
 * @param res - Express response object
 * @param next - Express next function for error handling
 *
 * @throws {ApiError} 401 - When user is not authenticated
 * @throws {ApiError} 400 - When required fields are missing
 */
export const createDream = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, generatedStory, generatedImage, isPublic } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Validate required fields
    if (!title || !description || !generatedStory) {
      throw new ApiError(400, "Title, description, and generated story are required");
    }

    // Create new dream
    const dream = new Dream({
      userId,
      userName: req.user?.name || "Unknown User",
      title,
      description,
      generatedStory,
      generatedImage: generatedImage || null,
      isPublic: isPublic || false,
    });

    await dream.save();

    res.status(201).json({
      success: true,
      message: "Dream created successfully",
      data: {
        dream: {
          id: dream._id,
          userId: dream.userId,
          userName: dream.userName,
          title: dream.title,
          description: dream.description,
          generatedStory: dream.generatedStory,
          generatedImage: dream.generatedImage,
          isPublic: dream.isPublic,
          createdAt: dream.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's dreams
 * GET /api/v1/dreams/my
 */
export const getMyDreams = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const dreams = await Dream.find({ userId }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      data: {
        dreams: dreams.map((dream) => ({
          id: dream._id,
          userId: dream.userId,
          userName: dream.userName,
          title: dream.title,
          description: dream.description,
          generatedStory: dream.generatedStory,
          generatedImage: dream.generatedImage,
          isPublic: dream.isPublic,
          createdAt: dream.createdAt,
        })),
        count: dreams.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get public dreams feed
 * GET /api/v1/dreams/public
 */
export const getPublicDreams = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const dreams = await Dream.find({ isPublic: true }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalCount = await Dream.countDocuments({ isPublic: true });

    res.status(200).json({
      success: true,
      data: {
        dreams: dreams.map((dream) => ({
          id: dream._id,
          userId: dream.userId,
          userName: dream.userName,
          title: dream.title,
          description: dream.description,
          generatedStory: dream.generatedStory,
          generatedImage: dream.generatedImage,
          isPublic: dream.isPublic,
          createdAt: dream.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single dream by ID
 * GET /api/v1/dreams/:id
 */
export const getDreamById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const dream = await Dream.findById(id);
    if (!dream) {
      throw new ApiError(404, "Dream not found");
    }

    // Check if user can access this dream
    if (!dream.isPublic && dream.userId.toString() !== userId) {
      throw new ApiError(403, "Access denied to this dream");
    }

    res.status(200).json({
      success: true,
      data: {
        dream: {
          id: dream._id,
          userId: dream.userId,
          userName: dream.userName,
          title: dream.title,
          description: dream.description,
          generatedStory: dream.generatedStory,
          generatedImage: dream.generatedImage,
          isPublic: dream.isPublic,
          createdAt: dream.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update dream
 * PUT /api/v1/dreams/:id
 */
export const updateDream = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, isPublic } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const dream = await Dream.findById(id);
    if (!dream) {
      throw new ApiError(404, "Dream not found");
    }

    // Check if user owns this dream
    if (dream.userId.toString() !== userId) {
      throw new ApiError(403, "You can only update your own dreams");
    }

    // Update fields
    if (title !== undefined) dream.title = title;
    if (description !== undefined) dream.description = description;
    if (isPublic !== undefined) dream.isPublic = isPublic;

    await dream.save();

    res.status(200).json({
      success: true,
      message: "Dream updated successfully",
      data: {
        dream: {
          id: dream._id,
          userId: dream.userId,
          userName: dream.userName,
          title: dream.title,
          description: dream.description,
          generatedStory: dream.generatedStory,
          generatedImage: dream.generatedImage,
          isPublic: dream.isPublic,
          createdAt: dream.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete dream
 * DELETE /api/v1/dreams/:id
 */
export const deleteDream = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const dream = await Dream.findById(id);
    if (!dream) {
      throw new ApiError(404, "Dream not found");
    }

    // Check if user owns this dream
    if (dream.userId.toString() !== userId) {
      throw new ApiError(403, "You can only delete your own dreams");
    }

    await Dream.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Dream deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
