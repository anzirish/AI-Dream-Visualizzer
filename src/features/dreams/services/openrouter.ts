/**
 * OpenRouter service - now proxied through backend
 * This file is kept for compatibility but now uses the backend API
 */

import { dreamService } from './dreamService';

// These functions now proxy to the backend API
// The backend handles all AI service integrations

export const generateDreamStory = async (title: string, description: string): Promise<string> => {
  try {
    return await dreamService.generateStory(title, description);
  } catch (error) {
    console.error('Error generating dream story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
};

export const generateDreamImage = async (description: string): Promise<string> => {
  try {
    return await dreamService.generateImage(description);
  } catch (error) {
    console.error('Error generating dream image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

// Note: All AI operations now go through the backend API
// The backend handles OpenRouter and Stable Diffusion integrations
// API keys are managed server-side for security