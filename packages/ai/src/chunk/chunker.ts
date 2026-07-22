import type { RepositoryContext } from "@repo/github";

import { estimateFileTokens } from "./estimator.js";
import { MAX_CHUNK_TOKENS } from "./constants.js";
import type {
  ChunkFile,
  ChunkMetadata,
  ChunkResult,
  RepositoryChunk,
} from "./types";

/**
 * Splits a RepositoryContext into AI-friendly chunks.
 */
export function chunkRepository(repository: RepositoryContext): ChunkResult {
  const chunks: RepositoryChunk[] = [];

  let currentChunk: RepositoryChunk = createChunk(1);

  for (const file of repository.files) {
    const estimatedTokens = estimateFileTokens(file);

    const chunkFile: ChunkFile = {
      ...file,
      estimatedTokens,
      characters: file.content.length,
    };

    // If adding this file exceeds the chunk limit,
    // finish the current chunk and start a new one.
    if (
      currentChunk.files.length > 0 &&
      currentChunk.estimatedTokens + estimatedTokens > MAX_CHUNK_TOKENS
    ) {
      chunks.push(currentChunk);

      currentChunk = createChunk(chunks.length + 1);
    }

    currentChunk.files.push(chunkFile);

    currentChunk.estimatedTokens += estimatedTokens;

    currentChunk.estimatedCharacters += chunkFile.characters;
  }

  // Push the last chunk
  if (currentChunk.files.length > 0) {
    chunks.push(currentChunk);
  }

  const metadata: ChunkMetadata = {
    repositoryName: repository.repositoryName,
    totalChunks: chunks.length,

    totalEstimatedTokens: chunks.reduce(
      (sum, chunk) => sum + chunk.estimatedTokens,
      0,
    ),

    totalCharacters: chunks.reduce(
      (sum, chunk) => sum + chunk.estimatedCharacters,
      0,
    ),
  };

  return {
    repository,
    chunks,
    metadata,
  };
}

/**
 * Creates an empty chunk.
 */
function createChunk(id: number): RepositoryChunk {
  return {
    id,

    files: [],

    estimatedTokens: 0,

    estimatedCharacters: 0,
  };
}
