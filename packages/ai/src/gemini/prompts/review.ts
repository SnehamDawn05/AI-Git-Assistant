import type { PRContext, RepositoryContext } from "@repo/github";

import { formatChunkResult, type ChunkResult } from "../../chunk/index.js";

export function buildReviewPrompt(
  repository: RepositoryContext,
  pr: PRContext,
  chunkResult: ChunkResult,
): string {
  return `
Repository:
${repository.repositoryName}

Pull Request Information

Title:
${pr.metadata.title}

Description:
${pr.metadata.body}

Author:
${pr.metadata.author}

Base Branch:
${pr.metadata.baseBranch}

Head Branch:
${pr.metadata.headBranch}

Commits:
${pr.metadata.commits}

Additions:
${pr.metadata.additions}

Deletions:
${pr.metadata.deletions}

Changed Files:

${pr.files.map((file) => `- ${file.path}`).join("\n")}

Repository Context:

${formatChunkResult(chunkResult)}

Review this pull request like a Senior Software Engineer.

Focus on:

- Bugs
- Logic issues
- Security
- Performance
- Maintainability
- Readability
- Best Practices

Return ONLY valid JSON.

Example:

{
  "summary": "...",
  "issues": [
    {
      "severity": "HIGH",
      "file": "src/index.ts",
      "title": "...",
      "explanation": "...",
      "suggestion": "..."
    }
  ]
}
`;
}
