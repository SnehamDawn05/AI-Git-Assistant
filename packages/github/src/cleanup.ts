import fs from "fs-extra";

/**
 * Deletes a cloned repository from the temporary directory.
 *
 * @param repositoryPath - Absolute path of the cloned repository
 */
export async function cleanupRepository(repositoryPath: string): Promise<void> {
  console.log("🗑️ Cleaning up temporary repository...");
  console.log(repositoryPath);

  await fs.remove(repositoryPath);

  console.log("✅ Temporary repository deleted");
}
