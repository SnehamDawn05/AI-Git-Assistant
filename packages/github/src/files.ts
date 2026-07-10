import path from "path";

import { glob } from "glob";

const IGNORE_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/coverage/**",
  "**/out/**",
];

export async function getRepositoryFiles(
  repositoryPath: string,
): Promise<string[]> {
  console.log("📂 Scanning repository...");

  const files = await glob("**/*", {
    cwd: repositoryPath,
    absolute: false,
    nodir: true,
    ignore: IGNORE_PATTERNS,
    dot: false,
  });

  const normalized = files.map((file) => file.split(path.sep).join("/")).sort();

  console.log(`📄 ${normalized.length} files found`);

  return normalized;
}
