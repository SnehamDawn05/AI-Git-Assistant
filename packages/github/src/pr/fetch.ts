import { getPullRequest, getPullRequestFiles } from "./client";
import type { GitHubPullRequestFileResponse } from "./github-types";
import type { ParsedPullRequestUrl } from "./parser";
import type { PRContext, PRFile, PRMetadata } from "./types";

/**
 * Fetches a pull request from GitHub and converts it into a PRContext.
 */
export async function fetchPullRequestContext(
  parsed: ParsedPullRequestUrl,
): Promise<PRContext> {
  const [pullRequest, files] = await Promise.all([
    getPullRequest(parsed),
    getPullRequestFiles(parsed),
  ]);

  const metadata: PRMetadata = {
    number: pullRequest.number,

    title: pullRequest.title ?? "",

    body: pullRequest.body ?? "",

    author: pullRequest.user.login,

    baseBranch: pullRequest.base.ref,

    headBranch: pullRequest.head.ref,

    commits: pullRequest.commits,

    additions: pullRequest.additions,

    deletions: pullRequest.deletions,

    changedFiles: pullRequest.changed_files,

    state: pullRequest.state,

    merged: pullRequest.merged,

    url: pullRequest.html_url,
  };

  const changedFiles: PRFile[] = files.map(
    (file: GitHubPullRequestFileResponse): PRFile => ({
      path: file.filename,

      status: file.status,

      additions: file.additions,

      deletions: file.deletions,

      patch: file.patch,

      previousFilename: file.previous_filename,
    }),
  );

  return {
    owner: parsed.owner,

    repository: parsed.repository,

    metadata,

    files: changedFiles,
  };
}
