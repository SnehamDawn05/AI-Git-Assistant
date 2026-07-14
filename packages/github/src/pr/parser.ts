/**
 * Parsed information from a GitHub Pull Request URL.
 */
export interface ParsedPullRequestUrl {
  owner: string;
  repository: string;
  pullNumber: number;
}

/**
 * Parses a GitHub Pull Request URL.
 *
 * Example:
 * https://github.com/facebook/react/pull/33522
 */
export function parsePullRequestUrl(url: string): ParsedPullRequestUrl {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (parsed.hostname !== "github.com") {
    throw new Error("Only GitHub Pull Request URLs are supported.");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);

  // Expected:
  // owner/repository/pull/123
  if (parts.length !== 4 || parts[2] !== "pull") {
    throw new Error("Invalid GitHub Pull Request URL.");
  }

  const owner = parts[0];
  const repository = parts[1];
  const pullNumber = Number(parts[3]);

  if (!owner) {
    throw new Error("Missing repository owner.");
  }

  if (!repository) {
    throw new Error("Missing repository name.");
  }

  if (Number.isNaN(pullNumber) || pullNumber <= 0) {
    throw new Error("Invalid pull request number.");
  }

  return {
    owner,
    repository,
    pullNumber,
  };
}

/**
 * Returns true if the URL is a valid GitHub Pull Request URL.
 */
export function isPullRequestUrl(url: string): boolean {
  try {
    parsePullRequestUrl(url);

    return true;
  } catch {
    return false;
  }
}
