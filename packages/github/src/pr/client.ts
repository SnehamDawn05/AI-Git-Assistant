import type {
  GitHubPullRequestFileResponse,
  GitHubPullRequestResponse,
} from "./github-types";
import type { ParsedPullRequestUrl } from "./parser";

const GITHUB_API = "https://api.github.com";

/**
 * Default headers for GitHub REST API.
 *
 * Authentication is intentionally omitted for the MVP.
 * This works for public repositories and pull requests.
 */
function getHeaders(): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "AI-Git-Assistant",
  };
}

/**
 * Makes a GET request to the GitHub REST API.
 */
async function githubRequest<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    let message = response.statusText;

    try {
      const error = (await response.json()) as {
        message?: string;
      };

      if (error.message) {
        message = error.message;
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(`GitHub API Error (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
}

/**
 * Fetches pull request details.
 */
export async function getPullRequest(
  pr: ParsedPullRequestUrl,
): Promise<GitHubPullRequestResponse> {
  return githubRequest<GitHubPullRequestResponse>(
    `${GITHUB_API}/repos/${pr.owner}/${pr.repository}/pulls/${pr.pullNumber}`,
  );
}

/**
 * Fetches all files changed in a pull request.
 */
export async function getPullRequestFiles(
  pr: ParsedPullRequestUrl,
): Promise<GitHubPullRequestFileResponse[]> {
  return githubRequest<GitHubPullRequestFileResponse[]>(
    `${GITHUB_API}/repos/${pr.owner}/${pr.repository}/pulls/${pr.pullNumber}/files`,
  );
}
