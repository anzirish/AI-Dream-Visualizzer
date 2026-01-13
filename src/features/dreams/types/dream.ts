// Dream feature type definitions for the AI Dreams application

export interface Dream {
  id: string; 
  userId: string; 
  userName?: string;
  title: string; 
  description: string; 
  generatedStory: string; 
  generatedImage?: string;
  isPublic: boolean;
  createdAt: Date;
}

// Form data structure for creating/editing dreams
export interface DreamFormData {
  title: string; 
  description: string;
  generatedStory?: string; 
  generatedImage?: string;
  isPublic?: boolean; 
}


