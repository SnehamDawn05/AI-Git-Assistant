import fs from "fs-extra";
import path from "path";
import { v4 as uuid } from "uuid";

/**
 * Base directory where repositories are cloned temporarily.
 *
 * Example:
 * C:\Users\<user>\AppData\Local\Temp\ai-git-assistant
 */
const TEMP_ROOT = path.join(process.cwd(), "tmp");

/**
 * Creates a unique temporary directory for a repository analysis.
 *
 * Example:
 * D:\AI-Git-Assistant\tmp\a4db92fe-7c87-4d59-a0e3-9d2f0c76d6d8
 */
export async function createTempDirectory(): Promise<string> {
  const directory = path.join(TEMP_ROOT, uuid());

  await fs.ensureDir(directory);

  return directory;
}
