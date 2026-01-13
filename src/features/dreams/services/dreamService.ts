/**
 * Dream service for handling dream-related API calls
 */

import { 
  createDream,
  getMyDreams,
  getPublicDreams,
  getDreamById,
  updateDream,
  deleteDream,
  generateCompleteDream,
  type Dream as BackendDream 
} from "@/services/api/backend";
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

    const backendDream = await createDream({
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
    const backendDreams = await getMyDreams();
    return backendDreams.map(convertBackendDream);
  },

  // Get public dreams
  async getPublicDreams(
    page = 1,
    limit = 20
  ): Promise<Dream[]> {
    const result = await getPublicDreams(page, limit);
    return result.dreams.map(convertBackendDream);
  },

  // Get dream by ID
  async getDreamById(id: string): Promise<Dream> {
    const backendDream = await getDreamById(id);
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
    const backendDream = await updateDream(id, updates);
    return convertBackendDream(backendDream);
  },

  // Delete dream
  async deleteDream(id: string): Promise<void> {
    await deleteDream(id);
  },

  // Generate complete dream (story + image with fallback)
  async generateCompleteDream(
    title: string,
    description: string
  ): Promise<{ story: string; image?: string }> {
    return await generateCompleteDream(title, description);
  },
};
