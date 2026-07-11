import fs from "fs-extra";
import path from "path";

import { IGNORED_EXTENSIONS, MAX_FILE_SIZE } from "./config";
import { detectLanguage } from "./language";
import { ProgrammingLanguage, RepositoryFile } from "./types";

/**
 * Returns true if the file extension should be ignored.
 */
function hasIgnoredExtension(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();

  return IGNORED_EXTENSIONS.has(extension);
}

/**
 * Reads a repository file and converts it into a RepositoryFile.
 *
 * Returns null if:
 * - the file is binary
 * - the extension is ignored
 * - the file is too large
 * - the file cannot be read
 */
export async function readRepositoryFile(
  repositoryRoot: string,
  absolutePath: string,
): Promise<RepositoryFile | null> {
  try {
    // Ignore unwanted extensions
    if (hasIgnoredExtension(absolutePath)) {
      return null;
    }

    const stats = await fs.stat(absolutePath);

    // Ignore directories
    if (!stats.isFile()) {
      return null;
    }

    // Ignore large files
    if (stats.size > MAX_FILE_SIZE) {
      return null;
    }

    // Read file
    const content = await fs.readFile(absolutePath, "utf8");

    // Skip empty files
    if (!content.trim()) {
      return null;
    }

    // Very simple binary detection
    if (content.includes("\u0000")) {
      return null;
    }

    const relativePath = path
      .relative(repositoryRoot, absolutePath)
      .replaceAll("\\", "/");

    const language = detectLanguage(absolutePath);

    return {
      path: relativePath,

      language,

      content,

      size: stats.size,
    };
  } catch (error) {
    console.warn(`⚠️ Failed to read ${absolutePath}`);

    console.warn(error);

    return null;
  }
}

/**
 * Reads multiple files concurrently.
 *
 * Files that fail validation or cannot be read
 * are automatically skipped.
 */
export async function readRepositoryFiles(
  repositoryRoot: string,
  absolutePaths: string[],
): Promise<RepositoryFile[]> {
  const results = await Promise.all(
    absolutePaths.map((file) => readRepositoryFile(repositoryRoot, file)),
  );

  return results.filter((file): file is RepositoryFile => file !== null);
}

/**
 * Returns true if the language is supported by the AI pipeline.
 */
export function isSupportedLanguage(language: ProgrammingLanguage): boolean {
  return language !== ProgrammingLanguage.UNKNOWN;
}
