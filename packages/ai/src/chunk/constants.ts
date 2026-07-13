/**
 * Approximate number of characters per token.
 *
 * This is a widely used heuristic for modern LLMs.
 */
export const CHARACTERS_PER_TOKEN = 4;

/**
 * Maximum tokens allowed in a single chunk.
 *
 * Keeping this below the model's context limit leaves room
 * for prompts and the model's response.
 */
export const MAX_CHUNK_TOKENS = 6000;

/**
 * Maximum characters allowed in a chunk.
 */
export const MAX_CHUNK_CHARACTERS = MAX_CHUNK_TOKENS * CHARACTERS_PER_TOKEN;
