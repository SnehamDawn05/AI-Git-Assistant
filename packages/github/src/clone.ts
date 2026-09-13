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

/**
 * Gets the latest commit SHA of a remote repository without cloning.
 */
export async function getRemoteHeadCommitSha(
  repositoryUrl: string,
): Promise<string | null> {
  try {
    const git = simpleGit();
    const result = await git.listRemote([repositoryUrl, "HEAD"]);

    if (!result) {
      return null;
    }

    const [sha] = result.trim().split(/\s+/);
    return sha || null;
  } catch (error) {
    console.warn(
      `⚠️ Failed to fetch remote commit SHA for ${repositoryUrl}:`,
      error,
    );
    return null;
  }
}

/**
 * Gets the current commit SHA of a local git repository clone.
 */
export async function getLocalCommitSha(
  repositoryPath: string,
): Promise<string | null> {
  try {
    const git = simpleGit(repositoryPath);
    const sha = await git.revparse(["HEAD"]);
    return sha.trim() || null;
  } catch (error) {
    console.warn(
      `⚠️ Failed to fetch local commit SHA at ${repositoryPath}:`,
      error,
    );
    return null;
  }
}
