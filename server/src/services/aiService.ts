// Removed ApiKey import - using environment variables only

/**
 * OpenRouter API Response Interface
 *
 * Defines the expected structure of responses from OpenRouter.ai API
 * for chat completion requests.
 *
 * @interface OpenRouterResponse
 */
interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/** OpenRouter.ai API endpoint for chat completions */
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Default LLM model for story generation (free tier) */
const MODEL = "mistralai/mistral-7b-instruct:free";

/** Stability AI endpoint for image generation */
const STABLE_DIFFUSION_URL =
  "https://api.stability.ai/v2beta/stable-image/generate/core";

/**
 * Get API Key from Environment Variables
 *
 * Retrieves API keys from environment variables only.
 * No database lookup or user-submitted keys.
 *
 * @param keyType - Type of API key needed ('openrouter' or 'stable_diffusion')
 * @returns API key string from environment variables
 *
 * @throws {Error} When environment variable is not configured
 */
const getApiKey = (keyType: "openrouter" | "stable_diffusion"): string => {
  const envKey =
    keyType === "openrouter"
      ? process.env.OPENROUTER_API_KEY
      : process.env.STABLE_DIFFUSION_API_KEY;

  if (!envKey) {
    throw new Error(
      `${keyType.toUpperCase()}_API_KEY environment variable is not configured`
    );
  }

  return envKey;
};

/**
 * Generate AI Dream Story
 *
 * Creates an AI-generated story based on user's dream title and description.
 * Uses OpenRouter.ai API with Mistral model to generate interpretive narrative
 * that transforms the raw dream into an engaging, immersive story.

 * @param title - User's dream title
 * @param description - User's detailed dream description
 * @returns Promise resolving to generated story text
 *
 * @throws {Error} When no API keys are available or generation fails
 */
export const generateDreamStory = async (
  title: string,
  description: string
): Promise<string> => {
  const prompt = `You are a skilled dream interpreter and storyteller. Transform the following dream into a compelling narrative.

Dream Title: "${title}"
Dream Description: "${description}"

Please provide a response in exactly this format:

INTERPRETATION:
Write one paragraph explaining why this dream might have occurred. Include possible symbolic meanings, emotional triggers, or subconscious messages. Keep it insightful but concise.

STORY:
Rewrite this dream as a vivid, immersive story in 3-4 paragraphs. Use rich sensory details, dreamlike imagery, and flowing narrative. Focus on atmosphere, emotions, and surreal elements that make dreams unique. Write in second person ("You find yourself...") to make it personal and engaging.

Important: Do not use markdown formatting, headers, or special characters. Write in plain text with natural paragraph breaks.`;

  try {
    const openRouterKey = getApiKey("openrouter");

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aidreams.app",
        "X-Title": "AIDreams",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenRouterResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No story generated from AI");
    }

    let story = data.choices[0].message.content.trim();

    // Clean up the response - simplified regex patterns
    const cleanupPatterns = [
      [
        /<s>|<\/s>|\[B_ANSWER\]|\[INST\]|\[\/INST\]|\[PROMPT\]|\[\/PROMPT\]/g,
        "",
      ],
      [/^["']|["']$/g, ""],
      [/^\*+|\*+$/g, ""],
      [/#{1,6}\s*/g, ""],
      [/\*\*(.*?)\*\*/g, "$1"],
      [/\*(.*?)\*/g, "$1"],
      [/AI Generated Story/gi, ""],
      [/^Response:?\s*/i, ""],
      [/^\d+\.\s*\*\*.*?\*\*\s*/gm, ""],
      [/^(INTERPRETATION|STORY):?\s*/gm, ""],
    ];

    story = cleanupPatterns
      .reduce(
        (text, [pattern, replacement]) =>
          text.replace(pattern as RegExp, replacement as string),
        story
      )
      .trim();

    return story;
  } catch (error) {
    console.error("Error generating dream story:", error);
    throw new Error("Failed to generate AI story. Please try again.");
  }
};

/**
 * Generate AI image from dream description
 */
export const generateDreamImage = async (
  description: string
): Promise<string> => {
  try {
    const stableDiffusionKey = getApiKey("stable_diffusion");

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
        Authorization: `Bearer ${stableDiffusionKey}`,
        Accept: "image/*",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Stable Diffusion API error:", errorText);
      throw new Error(`Stable Diffusion API error: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const buffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error generating dream image:", error);
    throw new Error("Failed to generate AI image. Please try again.");
  }
};
