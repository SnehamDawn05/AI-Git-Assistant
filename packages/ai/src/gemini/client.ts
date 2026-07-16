import { GoogleGenAI } from "@google/genai";

import {
  GEMINI_GENERATION_CONFIG,
  GEMINI_MODEL,
  getGeminiApiKey,
} from "./config";

/**
 * Singleton Gemini client.
 */
const ai = new GoogleGenAI({
  apiKey: getGeminiApiKey(),
});

/**
 * Sends a prompt to Gemini and returns the raw text response.
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,

    contents: prompt,

    config: GEMINI_GENERATION_CONFIG,
  });

  return response.text ?? "";
}
