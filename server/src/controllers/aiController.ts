import { Response, NextFunction } from "express";
import { generateDreamStory, generateDreamImage } from "../services/aiService";
import { ApiError } from "../middleware/errorHandler";
import { AuthenticatedRequest } from "../middleware/auth";
import Cover from "../models/Cover";

// Get random fallback cover image
const getRandomFallbackCover = async (): Promise<string | null> => {
  try {
    const coverCount = await Cover.countDocuments();
    if (coverCount === 0) {
      console.warn("No covers found in database");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * coverCount);
    const randomCover = await Cover.findOne().skip(randomIndex);
    return randomCover?.url || null;
  } catch (error) {
    console.error("Error fetching random cover:", error);
    return null;
  }
};

// Generate AI story handler
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
      data: { story },
    });
  } catch (error) {
    next(error);
  }
};

// Generate AI image handler
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
      const imageBase64 = await generateDreamImage(description);
      res.status(200).json({
        success: true,
        data: { image: imageBase64 },
      });
    } catch (aiError) {
      console.error("AI image generation failed, using fallback cover:", aiError);

      const fallbackCover = await getRandomFallbackCover();
      if (fallbackCover) {
        res.status(200).json({
          success: true,
          data: { image: fallbackCover },
          warning: "AI image generation failed, using fallback cover image",
        });
      } else {
        throw new ApiError(500, "Image generation failed and no fallback covers available");
      }
    }
  } catch (error) {
    next(error);
  }
};

// Generate complete dream with AI story and image
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

    const promises = [
      generateDreamStory(title, description),
      generateDreamImage(description),
    ];

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
      image = imageResult.value;
    } else {
      console.error("AI image generation failed, using fallback cover:", imageResult.reason);
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
      data: { story, image },
      ...(warning && { warning }),
    });
  } catch (error) {
    next(error);
  }
};
