/**
 * OpenRouter API base URL (OpenAI-compatible).
 */
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Default OpenRouter model.
 *
 * Uses `openrouter/free` to automatically route requests to an available
 * free-tier model matching the payload requirements.
 */
export const OPENROUTER_MODEL = "openrouter/free";

/**
 * Generation configuration (OpenAI-compatible chat completions parameters).
 */
export const OPENROUTER_GENERATION_CONFIG = {
  temperature: 0.2,
  top_p: 0.95,
  max_tokens: 8192,
} as const;

/**
 * Reads the OpenRouter API key from the environment.
 */
export function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY environment variable is not configured.",
    );
  }

  return apiKey;
}

/**
 * Maximum repository context we allow
 * before refusing analysis.
 */
export const MAX_CONTEXT_TOKENS = 900000;
