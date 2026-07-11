import path from "path";

import { getRepositoryFiles } from "../files";

import { CONCURRENT_READS, MAX_FILES, MAX_REPOSITORY_SIZE } from "./config";
import { sortFilesByPriority } from "./priorities";
import { readRepositoryFiles } from "./reader";
import { RepositoryContext, RepositoryFile } from "./types";

/**
 * Loads an entire repository into a RepositoryContext.
 *
 * Steps:
 * 1. Scan repository files
 * 2. Prioritize important files
 * 3. Read files concurrently
 * 4. Respect file count and size limits
 * 5. Build RepositoryContext
 */
export async function loadRepositoryContext(
  repositoryPath: string,
): Promise<RepositoryContext> {
  console.log("📂 Scanning repository...");

  const relativeFiles = await getRepositoryFiles(repositoryPath);

  console.log(`📄 ${relativeFiles.length} files found`);

  const prioritizedFiles = sortFilesByPriority(relativeFiles);

  const repositoryFiles: RepositoryFile[] = [];

  let totalSize = 0;

  let readme: string | undefined;
  let packageJson: string | undefined;

  for (
    let index = 0;
    index < prioritizedFiles.length;
    index += CONCURRENT_READS
  ) {
    if (
      repositoryFiles.length >= MAX_FILES ||
      totalSize >= MAX_REPOSITORY_SIZE
    ) {
      break;
    }

    const batch = prioritizedFiles.slice(index, index + CONCURRENT_READS);

    const absolutePaths = batch.map((file) => path.join(repositoryPath, file));

    const parsedFiles = await readRepositoryFiles(
      repositoryPath,
      absolutePaths,
    );

    for (const file of parsedFiles) {
      if (repositoryFiles.length >= MAX_FILES) {
        break;
      }

      if (totalSize + file.size > MAX_REPOSITORY_SIZE) {
        break;
      }

      repositoryFiles.push(file);

      totalSize += file.size;

      const fileName = path.basename(file.path).toLowerCase();

      if (fileName === "readme.md" && !readme) {
        readme = file.content;
      }

      if (fileName === "package.json" && !packageJson) {
        packageJson = file.content;
      }
    }
  }

  const folders = extractFolders(repositoryFiles.map((file) => file.path));

  console.log(`✅ Loaded ${repositoryFiles.length} files`);

  console.log(`💾 Context Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  return {
    repositoryName: path.basename(repositoryPath),

    totalFiles: repositoryFiles.length,

    totalSize,

    files: repositoryFiles,

    readme,

    packageJson,

    folders,
  };
}

/**
 * Extract every folder that exists inside the repository.
 *
 * Example:
 *
 * src/app/page.tsx
 * src/components/button.tsx
 *
 * =>
 *
 * [
 *   "src",
 *   "src/app",
 *   "src/components"
 * ]
 */
function extractFolders(filePaths: string[]): string[] {
  const folders = new Set<string>();

  for (const file of filePaths) {
    const parts = file.split("/");

    parts.pop();

    let current = "";

    for (const part of parts) {
      current = current ? `${current}/${part}` : part;

      folders.add(current);
    }
  }

  return [...folders].sort();
}
