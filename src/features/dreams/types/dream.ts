/**
 * Dream Feature Type Definitions
 *
 * TypeScript interfaces and types for dream-related data structures,
 * API responses, and form data used throughout the AI Dreams application.
 */

/**
 * Complete dream data structure representing a user's dream entry
 */
export interface Dream {
  /** Unique dream identifier */
  id: string;
  /** ID of the user who created this dream */
  userId: string;
  /** Name of the user who created this dream (for display purposes) */
  userName?: string;
  /** User-provided title for the dream */
  title: string;
  /** User-provided description of the dream */
  description: string;
  /** AI-generated story based on the dream description */
  generatedStory: string;
  /** AI-generated image URL (optional) */
  generatedImage?: string;
  /** Whether the dream is visible to other users */
  isPublic: boolean;
  /** When the dream was created */
  createdAt: Date;
}

/**
 * Form data structure for creating/editing dreams
 */
export interface DreamFormData {
  /** Dream title */
  title: string;
  /** Dream description */
  description: string;
  /** Generated story content (populated after AI generation) */
  generatedStory?: string;
  /** Generated image URL (populated after AI generation) */
  generatedImage?: string;
  /** Public visibility setting */
  isPublic?: boolean;
}

/**
 * Response structure from OpenRouter AI API
 */
export interface OpenRouterResponse {
  /** Array of AI-generated response choices */
  choices: {
    /** Message containing the AI-generated content */
    message: {
      /** The actual generated text content */
      content: string;
    };
  }[];
}
