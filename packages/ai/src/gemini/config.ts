/**
 * Default Gemini model.
 *
 * We use Gemini 2.5 Flash because it provides an excellent
 * balance of quality, speed, and cost for repository analysis.
 */
export const GEMINI_MODEL = "gemini-3.1-flash-lite";

/**
 * Generation configuration.
 */
export const GEMINI_GENERATION_CONFIG = {
  temperature: 0.2,

  topP: 0.95,

  maxOutputTokens: 8192,
} as const;

/**
 * Reads the Gemini API key from the environment.
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  return apiKey;
}

/**
 * Maximum repository context we allow
 * before refusing analysis.
 */
export const MAX_CONTEXT_TOKENS = 900000;
