// Dream feature type definitions for the AI Dreams application

// Complete dream data structure representing a user's dream entry
export interface Dream {
  id: string; // Unique dream identifier
  userId: string; // ID of the user who created this dream
  userName?: string; // Name of the user who created this dream (for display purposes)
  title: string; // User-provided title for the dream
  description: string; // User-provided description of the dream
  generatedStory: string; // AI-generated story based on the dream description
  generatedImage?: string; // AI-generated image URL (optional)
  isPublic: boolean; // Whether the dream is visible to other users
  createdAt: Date; // When the dream was created
}

// Form data structure for creating/editing dreams
export interface DreamFormData {
  title: string; // Dream title
  description: string; // Dream description
  generatedStory?: string; // Generated story content (populated after AI generation)
  generatedImage?: string; // Generated image URL (populated after AI generation)
  isPublic?: boolean; // Public visibility setting
}


