import { RepositoryFile } from "@repo/github";

import { CHARACTERS_PER_TOKEN } from "./constants";

/**
 * Estimate the number of tokens for a string.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARACTERS_PER_TOKEN);
}

/**
 * Estimate the number of tokens for a repository file.
 */
export function estimateFileTokens(file: RepositoryFile): number {
  return estimateTokens(file.content);
}

/**
 * Estimate the total number of characters.
 */
export function estimateCharacters(text: string): number {
  return text.length;
}
