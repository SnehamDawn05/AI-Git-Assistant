import { fetchPullRequestContext } from "./fetch.js";
import { parsePullRequestUrl } from "./parser.js";
import type { PRContext } from "./types.js";

/**
 * Loads a complete PRContext from a GitHub Pull Request URL.
 */
export async function loadPullRequestContext(
  pullRequestUrl: string,
): Promise<PRContext> {
  const parsed = parsePullRequestUrl(pullRequestUrl);

  return fetchPullRequestContext(parsed);
}
