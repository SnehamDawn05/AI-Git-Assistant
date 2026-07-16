import type { ChunkResult, RepositoryChunk } from "./types";

/**
 * Formats a single repository chunk into markdown.
 */
export function formatChunk(chunk: RepositoryChunk): string {
  return chunk.files
    .map(
      (file) => `
## ${file.path}

Language: ${file.language}

\`\`\`${file.language}
${file.content.slice(0, 12000)}
\`\`\`
`,
    )
    .join("\n");
}

/**
 * Formats an entire ChunkResult into markdown.
 */
export function formatChunkResult(chunkResult: ChunkResult): string {
  return chunkResult.chunks
    .sort((a, b) => a.id - b.id)
    .map(
      (chunk) => `
# Chunk ${chunk.id}

${formatChunk(chunk)}
`,
    )
    .join("\n\n");
}
