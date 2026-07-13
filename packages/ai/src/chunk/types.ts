import type { RepositoryContext, RepositoryFile } from "@repo/github";

/**
 * A file inside a chunk.
 */
export interface ChunkFile extends RepositoryFile {
  /**
   * Estimated number of tokens for this file.
   */
  estimatedTokens: number;

  /**
   * Number of characters in the file.
   */
  characters: number;
}

/**
 * A chunk that will be sent to the AI.
 */
export interface RepositoryChunk {
  /**
   * Chunk identifier.
   */
  id: number;

  /**
   * Files contained in this chunk.
   */
  files: ChunkFile[];

  /**
   * Estimated total tokens.
   */
  estimatedTokens: number;

  /**
   * Total characters.
   */
  estimatedCharacters: number;
}

/**
 * Metadata about the chunking process.
 */
export interface ChunkMetadata {
  /**
   * Original repository.
   */
  repositoryName: string;

  /**
   * Number of chunks generated.
   */
  totalChunks: number;

  /**
   * Estimated tokens across all chunks.
   */
  totalEstimatedTokens: number;

  /**
   * Total characters across all chunks.
   */
  totalCharacters: number;
}

/**
 * Final output of the chunking engine.
 */
export interface ChunkResult {
  /**
   * Original repository context.
   */
  repository: RepositoryContext;

  /**
   * Generated chunks.
   */
  chunks: RepositoryChunk[];

  /**
   * Chunking statistics.
   */
  metadata: ChunkMetadata;
}
