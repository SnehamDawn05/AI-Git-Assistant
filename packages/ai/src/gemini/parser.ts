import type { ReadmeResult, ReviewResult, SummaryResult } from "./types";

/**
 * Gemini sometimes wraps JSON inside
 * ```json
 * ...
 * ```
 * Remove the code fences before parsing.
 */
function extractJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export function parseSummaryResult(response: string): SummaryResult {
  return JSON.parse(extractJson(response)) as SummaryResult;
}

export function parseReadmeResult(response: string): ReadmeResult {
  return {
    markdown: response.trim(),
  };
}

export function parseReviewResult(response: string): ReviewResult {
  return JSON.parse(extractJson(response)) as ReviewResult;
}
