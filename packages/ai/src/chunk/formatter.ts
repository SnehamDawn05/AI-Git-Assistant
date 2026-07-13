import type { ChunkFile, RepositoryChunk } from "./types";

/**
 * Formats a single repository file into prompt-friendly text.
 */
export function formatFile(file: ChunkFile): string {
  return [
    "==================================================",
    `File: ${file.path}`,
    `Language: ${file.language}`,
    "==================================================",
    "",
    file.content.trim(),
    "",
  ].join("\n");
}

/**
 * Formats an entire chunk into a prompt-ready string.
 */
export function formatChunk(chunk: RepositoryChunk): string {
  const header = [
    "##################################################",
    `Chunk ${chunk.id}`,
    `Files: ${chunk.files.length}`,
    `Estimated Tokens: ${chunk.estimatedTokens}`,
    `Characters: ${chunk.estimatedCharacters}`,
    "##################################################",
    "",
  ].join("\n");

  const files = chunk.files.map(formatFile).join("\n");

  return header + files;
}

/**
 * Formats every chunk.
 */
export function formatChunks(chunks: RepositoryChunk[]): string[] {
  return chunks.map(formatChunk);
}
