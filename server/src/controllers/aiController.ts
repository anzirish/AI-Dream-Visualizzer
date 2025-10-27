import { Response, NextFunction } from "express";
import { generateDreamStory, generateDreamImage } from "../services/aiService";
import { ApiError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";

/**
 * Generate AI Story Handler
 *
 * Creates an AI-generated story based on user's dream title and description.
 * Uses community API keys and advanced language models for content generation.
 *
 * @route POST /api/v1/ai/generate-story
 * @access Private (requires authentication)
 *
 * @param req - Authenticated request with dream data
 * @param res - Express response object
 * @param next - Express next function for error handling
 *
 * @throws {ApiError} 400 - When title or description is missing
 */
export const generateStory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Title and description are required");
    }

    const story = await generateDreamStory(title, description);

    res.status(200).json({
      success: true,
      data: {
        story,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate AI image from dream description
 * POST /api/v1/ai/generate-image
 */
export const generateImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { description } = req.body;

    if (!description) {
      throw new ApiError(400, "Description is required");
    }

    const imageBase64 = await generateDreamImage(description);

    res.status(200).json({
      success: true,
      data: {
        image: imageBase64,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate complete dream with AI story and image
 * POST /api/v1/ai/generate-complete
 */
export const generateCompleteDream = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, includeImage = false } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Title and description are required");
    }

    // Generate story (always)
    const storyPromise = generateDreamStory(title, description);

    // Generate image (optional)
    const imagePromise = includeImage ? generateDreamImage(description) : Promise.resolve(null);

    // Wait for both to complete
    const [story, image] = await Promise.all([storyPromise, imagePromise]);

    res.status(200).json({
      success: true,
      data: {
        story,
        image,
      },
    });
  } catch (error) {
    next(error);
  }
};
