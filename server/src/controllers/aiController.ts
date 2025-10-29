import { Response, NextFunction } from "express";
import { generateDreamStory, generateDreamImage } from "../services/aiService";
import { ApiError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";
import Cover from "../models/Cover";

/**
 * Get Random Fallback Cover Image
 *
 * Fetches a random cover image from the database to use when AI image generation fails.
 *
 * @returns Promise resolving to a random cover image URL, or null if no covers available
 */
const getRandomFallbackCover = async (): Promise<string | null> => {
  try {
    // Get count of covers
    const coverCount = await Cover.countDocuments();

    if (coverCount === 0) {
      console.warn("No covers found in database");
      return null;
    }

    // Generate random index
    const randomIndex = Math.floor(Math.random() * coverCount);

    // Get random cover using skip and load only one imag
    const randomCover = await Cover.findOne().skip(randomIndex);

    return randomCover?.url || null;
  } catch (error) {
    console.error("Error fetching random cover:", error);
    return null;
  }
};

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
export const generateStory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
 *
 * If AI image generation fails, returns a random fallback cover from database.
 */
export const generateImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { description } = req.body;

    if (!description) {
      throw new ApiError(400, "Description is required");
    }

    try {
      // Try AI image generation first
      const imageBase64 = await generateDreamImage(description);

      res.status(200).json({
        success: true,
        data: {
          image: imageBase64,
        },
      });
    } catch (aiError) {
      console.error(
        "AI image generation failed, using fallback cover:",
        aiError
      );

      // Try to get a random fallback cover from database
      const fallbackCover = await getRandomFallbackCover();

      if (fallbackCover) {
        res.status(200).json({
          success: true,
          data: {
            image: fallbackCover,
          },
          warning: "AI image generation failed, using fallback cover image",
        });
      } else {
        throw new ApiError(
          500,
          "Image generation failed and no fallback covers available"
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Generate complete dream with AI story and image
 * POST /api/v1/ai/generate-complete
 *
 * Always generates both story and image:
 * - Story generation is required and will fail the request if it fails
 * - Image generation tries AI first, falls back to random cover if AI fails
 */
export const generateCompleteDream = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "Title and description are required");
    }

    // Prepare promises for parallel execution
    const promises = [
      generateDreamStory(title, description), // Always generate story
      generateDreamImage(description), // Always try to generate image
    ];

    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(promises);

    // Extract story result (required)
    const storyResult = results[0];
    if (storyResult.status === "rejected") {
      throw new Error(`Story generation failed: ${storyResult.reason.message}`);
    }
    const story = storyResult.value;

    // Extract image result (always provide an image)
    const imageResult = results[1];
    let image = null;
    let warning = null;

    if (imageResult.status === "fulfilled") {
      // AI image generation succeeded
      image = imageResult.value;
    } else {
      // AI image generation failed, use fallback cover
      console.error(
        "AI image generation failed, using fallback cover:",
        imageResult.reason
      );

      const fallbackCover = await getRandomFallbackCover();

      if (fallbackCover) {
        image = fallbackCover;
        warning = "AI image generation failed, using fallback cover image";
      } else {
        warning = "Image generation failed and no fallback covers available";
      }
    }

    res.status(200).json({
      success: true,
      data: {
        story,
        image,
      },
      ...(warning && { warning }),
    });
  } catch (error) {
    next(error);
  }
};
