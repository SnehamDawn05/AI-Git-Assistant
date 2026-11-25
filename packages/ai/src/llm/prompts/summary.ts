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

Return ONLY valid JSON where every array contains plain strings (and each "modules" entry uses "moduleName: description").

Example:

{
  "overview": "...",
  "architecture": "...",
  "techStack": ["TypeScript", "Next.js"],
  "modules": ["apps/web: Next.js frontend application"],
  "strengths": ["..."],
  "improvements": ["..."]
}
`;
}
