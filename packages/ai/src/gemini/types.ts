/**
 * Supported AI features.
 */
export enum GeminiTask {
  SUMMARY = "SUMMARY",
  README = "README",
  REVIEW = "REVIEW",
}

export interface GeminiOptions {
  temperature?: number;
  maxOutputTokens?: number;
}

/* ----------------------------------------- */
/* Summary */
/* ----------------------------------------- */

export interface SummaryResult {
  overview: string;

  architecture: string;

  techStack: string[];

  modules: string[];

  strengths: string[];

  improvements: string[];
}

/* ----------------------------------------- */
/* README */
/* ----------------------------------------- */

export interface ReadmeResult {
  markdown: string;
}

/* ----------------------------------------- */
/* PR Review */
/* ----------------------------------------- */

export interface ReviewIssue {
  severity: "LOW" | "MEDIUM" | "HIGH";

  file?: string;

  title: string;

  explanation: string;

  suggestion: string;
}

export interface ReviewResult {
  summary: string;

  issues: ReviewIssue[];
}
