import type { RepositoryContext } from "@repo/github";

import { formatChunkResult, type ChunkResult } from "../../chunk/index.js";

export function buildSummaryPrompt(
  repository: RepositoryContext,
  chunkResult: ChunkResult,
): string {
  return `
Repository Name:
${repository.repositoryName}

Total Files:
${repository.totalFiles}

Repository Context:

${formatChunkResult(chunkResult)}

Generate a comprehensive repository summary.

Return ONLY valid JSON.

Example:

{
  "overview": "...",
  "architecture": "...",
  "techStack": [],
  "modules": [],
  "strengths": [],
  "improvements": []
}
`;
}
