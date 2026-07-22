import simpleGit from "simple-git";

import { createTempDirectory } from "./temp.js";

/**
 * Clone a GitHub repository into a temporary directory.
 */
export async function cloneRepository(repositoryUrl: string): Promise<string> {
  const repositoryPath = await createTempDirectory();

  console.log("📥 Creating Git instance...");

  const git = simpleGit({
    progress({ method, stage, progress }) {
      console.log(`📦 ${method} ${stage} ${progress}%`);
    },
  });

  console.log("📥 Starting shallow clone...");
  console.log(repositoryUrl);

  await git.clone(repositoryUrl, repositoryPath, ["--depth", "1"]);

  console.log("✅ Repository cloned successfully");
  console.log(repositoryPath);

  return repositoryPath;
}
