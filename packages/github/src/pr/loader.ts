import { fetchPullRequestContext } from "./fetch";
import { parsePullRequestUrl } from "./parser";
import type { PRContext } from "./types";

/**
 * Loads a complete PRContext from a GitHub Pull Request URL.
 */
export async function loadPullRequestContext(
  pullRequestUrl: string,
): Promise<PRContext> {
  const parsed = parsePullRequestUrl(pullRequestUrl);

  return fetchPullRequestContext(parsed);
}
