import type { ReadmeResult, ReviewResult, SummaryResult } from "./types";

/**
 * LLMs sometimes wrap JSON inside
 * ```json
 * ...
 * ```
 * Remove the code fences before parsing.
 */
function extractJson(text: string): string {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
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
