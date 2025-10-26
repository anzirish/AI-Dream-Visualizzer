import type { OpenRouterResponse } from '../types/dream';
import { getApiKeys } from '@/services/api/apiKeys';

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const STABLE_DIFFUSION_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";

export const generateDreamStory = async (title: string, description: string): Promise<string> => {
  const prompt = `You are a dream interpreter and storyteller. I will give you a dream with a title and description. 

Your task has two parts:

1. **Why this dream happened**: Suggest a thoughtful explanation for why this dream may have occurred, including possible symbolic meanings, emotional triggers, or subconscious reasons. Keep this part 1 paragraph. 

2. **Detailed Dream Story**: Rewrite the dream into a vivid, detailed story (4-5 paragraphs). Focus on surreal and dreamlike imagery, sensory details (sight, sound, feeling, atmosphere), and symbolic elements. Make it immersive, like a short cinematic scene that captures the essence of the dream. 

Dream: "${title}"  
Description: "${description}"  

Response:`;

  try {
    const { openRouterKey } = await getApiKeys();

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "DreamForge"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.9,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No story generated');
    }

    let story = data.choices[0].message.content.trim();
    
    story = story
      .replace(/<s>|<\/s>|\[B_ANSWER\]|\[INST\]|\[\/INST\]|\[PROMPT\]|\[\/PROMPT\]/g, "")
      .replace(/^["']|["']$/g, '')
      .replace(/^\*+|\*+$/g, '')
      .trim();

    return story;
  } catch (error) {
    console.error('Error generating dream story:', error);
    throw new Error('Failed to generate story. Please try again.');
  }
};

export const generateDreamImage = async (description: string): Promise<string> => {
  try {
    const { stableDiffusionKey } = await getApiKeys();

    const formData = new FormData();
    formData.append("prompt", `Dreamlike surreal scene: ${description}`);
    formData.append("cfg_scale", "7");
    formData.append("height", "512");
    formData.append("width", "512");
    formData.append("samples", "1");
    formData.append("steps", "30");

    const response = await fetch(STABLE_DIFFUSION_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stableDiffusionKey}`,
        "Accept": "image/*",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Stable Diffusion API error: ${response.status}`);
    }

    const imageBlob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    console.error('Error generating dream image:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};