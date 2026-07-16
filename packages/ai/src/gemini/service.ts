import type { PRContext, RepositoryContext } from "@repo/github";

import { chunkRepository } from "../chunk";

import { generateText } from "./client";
import {
  parseReadmeResult,
  parseReviewResult,
  parseSummaryResult,
} from "./parser";
import {
  buildReadmePrompt,
  buildReviewPrompt,
  buildSummaryPrompt,
  buildSystemPrompt,
} from "./prompts";
import { withRetry } from "./retry";
import type { ReadmeResult, ReviewResult, SummaryResult } from "./types";
import { MAX_CONTEXT_TOKENS } from "./config";

/**
 * Generates a repository summary using a single Gemini request.
 */
export async function generateSummary(
  repository: RepositoryContext,
): Promise<SummaryResult> {
  console.log("🧠 Chunking repository...");

  const chunkResult = chunkRepository(repository);

  if (chunkResult.metadata.totalEstimatedTokens > MAX_CONTEXT_TOKENS) {
    throw new Error(
      `Repository is too large (${chunkResult.metadata.totalEstimatedTokens} estimated tokens).`,
    );
  }

  console.log(
    `📦 ${chunkResult.metadata.totalChunks} chunk(s), ${chunkResult.metadata.totalEstimatedTokens} estimated tokens`,
  );

  const prompt = `
${buildSystemPrompt()}

${buildSummaryPrompt(repository, chunkResult)}
`;

  console.log("🤖 Sending request to Gemini...");

  const response = await withRetry(() => generateText(prompt));

  console.log("✅ Gemini response received");

  return parseSummaryResult(response);
}

/**
 * Generates a README using a single Gemini request.
 */
export async function generateReadme(
  repository: RepositoryContext,
): Promise<ReadmeResult> {
  console.log("🧠 Chunking repository...");

  const chunkResult = chunkRepository(repository);

  if (chunkResult.metadata.totalEstimatedTokens > MAX_CONTEXT_TOKENS) {
    throw new Error(
      `Repository is too large (${chunkResult.metadata.totalEstimatedTokens} estimated tokens).`,
    );
  }

  console.log(
    `📦 ${chunkResult.metadata.totalChunks} chunk(s), ${chunkResult.metadata.totalEstimatedTokens} estimated tokens`,
  );

  const prompt = `
${buildSystemPrompt()}

${buildReadmePrompt(repository, chunkResult)}
`;

  console.log("🤖 Sending request to Gemini...");

  const response = await withRetry(() => generateText(prompt));

  console.log("✅ Gemini response received");

  return parseReadmeResult(response);
}

/**
 * Reviews a pull request using a single Gemini request.
 */
export async function reviewPullRequest(
  repository: RepositoryContext,
  pr: PRContext,
): Promise<ReviewResult> {
  console.log("🧠 Chunking repository...");

  const chunkResult = chunkRepository(repository);

  if (chunkResult.metadata.totalEstimatedTokens > MAX_CONTEXT_TOKENS) {
    throw new Error(
      `Repository is too large (${chunkResult.metadata.totalEstimatedTokens} estimated tokens).`,
    );
  }

  console.log(
    `📦 ${chunkResult.metadata.totalChunks} chunk(s), ${chunkResult.metadata.totalEstimatedTokens} estimated tokens`,
  );

  const prompt = `
${buildSystemPrompt()}

${buildReviewPrompt(repository, pr, chunkResult)}
`;

  console.log("🤖 Sending request to Gemini...");

  const response = await withRetry(() => generateText(prompt));

  console.log("✅ Gemini response received");

  return parseReviewResult(response);
}
