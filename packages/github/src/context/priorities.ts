import path from "path";

import { HIGH_PRIORITY_FILES, SOURCE_DIRECTORIES } from "./config.js";

/**
 * Returns a priority score for a repository file.
 *
 * Higher score = processed earlier.
 */
export function getFilePriority(filePath: string): number {
  const normalizedPath = filePath.replaceAll("\\", "/");

  const fileName = path.basename(normalizedPath);

  // ------------------------------------------------------------
  // Highest Priority (Repository Metadata)
  // ------------------------------------------------------------

  if (HIGH_PRIORITY_FILES.has(fileName)) {
    return 100;
  }

  // ------------------------------------------------------------
  // Source Entry Points
  // ------------------------------------------------------------

  if (
    normalizedPath.endsWith("/index.ts") ||
    normalizedPath.endsWith("/index.tsx") ||
    normalizedPath.endsWith("/index.js") ||
    normalizedPath.endsWith("/index.jsx") ||
    normalizedPath.endsWith("/main.ts") ||
    normalizedPath.endsWith("/main.tsx") ||
    normalizedPath.endsWith("/main.js") ||
    normalizedPath.endsWith("/main.jsx") ||
    normalizedPath.endsWith("/App.tsx") ||
    normalizedPath.endsWith("/App.jsx")
  ) {
    return 95;
  }

  // ------------------------------------------------------------
  // Source Directories
  // ------------------------------------------------------------

  const directories = normalizedPath.split("/");

  if (directories.some((directory) => SOURCE_DIRECTORIES.has(directory))) {
    return 80;
  }

  // ------------------------------------------------------------
  // Configuration Files
  // ------------------------------------------------------------

  if (
    fileName.endsWith(".config.ts") ||
    fileName.endsWith(".config.js") ||
    fileName.endsWith(".config.mjs") ||
    fileName.endsWith(".config.cjs")
  ) {
    return 75;
  }

  // ------------------------------------------------------------
  // Tests
  // ------------------------------------------------------------

  if (
    normalizedPath.includes("/test/") ||
    normalizedPath.includes("/tests/") ||
    normalizedPath.includes("/__tests__/") ||
    normalizedPath.endsWith(".test.ts") ||
    normalizedPath.endsWith(".test.tsx") ||
    normalizedPath.endsWith(".test.js") ||
    normalizedPath.endsWith(".test.jsx") ||
    normalizedPath.endsWith(".spec.ts") ||
    normalizedPath.endsWith(".spec.tsx") ||
    normalizedPath.endsWith(".spec.js") ||
    normalizedPath.endsWith(".spec.jsx")
  ) {
    return 30;
  }

  // ------------------------------------------------------------
  // Documentation
  // ------------------------------------------------------------

  if (normalizedPath.includes("/docs/") || fileName.endsWith(".md")) {
    return 20;
  }

  // ------------------------------------------------------------
  // Default
  // ------------------------------------------------------------

  return 10;
}

/**
 * Sort repository files from highest priority to lowest.
 */
export function sortFilesByPriority(files: string[]): string[] {
  return [...files].sort((a, b) => getFilePriority(b) - getFilePriority(a));
}
