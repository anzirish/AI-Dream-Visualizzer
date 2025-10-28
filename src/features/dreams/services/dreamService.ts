/**
 * Dream service for handling dream-related API calls
 */

import { backendAPI, type Dream as BackendDream } from "@/services/api/backend";
import type { Dream, DreamFormData } from "../types/dream";

// Convert backend dream format to frontend dream format
const convertBackendDream = (backendDream: BackendDream): Dream => ({
  id: backendDream.id,
  userId: backendDream.userId,
  userName: backendDream.userName,
  title: backendDream.title,
  description: backendDream.description,
  generatedStory: backendDream.generatedStory,
  generatedImage: backendDream.generatedImage || undefined,
  isPublic: backendDream.isPublic,
  createdAt: new Date(backendDream.createdAt),
});

export const dreamService = {
  // Create a new dream
  async createDream(dreamData: DreamFormData): Promise<Dream> {
    // Ensure required fields are present
    if (!dreamData.generatedStory) {
      throw new Error("Generated story is required to create a dream");
    }

    const backendDream = await backendAPI.createDream({
      title: dreamData.title,
      description: dreamData.description,
      generatedStory: dreamData.generatedStory,
      generatedImage: dreamData.generatedImage || undefined,
      isPublic: dreamData.isPublic || false,
    });

    return convertBackendDream(backendDream);
  },

  // Get user's dreams
  async getMyDreams(): Promise<Dream[]> {
    const backendDreams = await backendAPI.getMyDreams();
    return backendDreams.map(convertBackendDream);
  },

  // Get public dreams
  async getPublicDreams(
    page = 1,
    limit = 20
  ): Promise<{
    dreams: Dream[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const result = await backendAPI.getPublicDreams(page, limit);
    return {
      dreams: result.dreams.map(convertBackendDream),
      pagination: result.pagination,
    };
  },

  // Get dream by ID
  async getDreamById(id: string): Promise<Dream> {
    const backendDream = await backendAPI.getDreamById(id);
    return convertBackendDream(backendDream);
  },

  // Update dream
  async updateDream(
    id: string,
    updates: {
      title?: string;
      description?: string;
      isPublic?: boolean;
    }
  ): Promise<Dream> {
    const backendDream = await backendAPI.updateDream(id, updates);
    return convertBackendDream(backendDream);
  },

  // Delete dream
  async deleteDream(id: string): Promise<void> {
    await backendAPI.deleteDream(id);
  },

  // Generate AI story
  async generateStory(title: string, description: string): Promise<string> {
    return await backendAPI.generateStory(title, description);
  },

  // Generate AI image
  async generateImage(description: string): Promise<string> {
    return await backendAPI.generateImage(description);
  },

  // Generate complete dream (story + optional image)
  async generateCompleteDream(
    title: string,
    description: string,
    includeImage = false
  ): Promise<{ story: string; image?: string }> {
    return await backendAPI.generateCompleteDream(
      title,
      description,
      includeImage
    );
  },
};
