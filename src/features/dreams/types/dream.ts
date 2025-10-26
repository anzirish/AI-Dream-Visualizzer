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

export interface DreamFormData {
  title: string;
  description: string;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface ApiKeys {
  openRouterKey: string;
  stableDiffusionKey: string;
}