/**
 * Represents a single file changed in a pull request.
 */
export interface PRFile {
  /**
   * File path inside the repository.
   */
  path: string;

  /**
   * File status.
   */
  status: "added" | "modified" | "removed" | "renamed";

  /**
   * Number of lines added.
   */
  additions: number;

  /**
   * Number of lines deleted.
   */
  deletions: number;

  /**
   * Unified diff (patch) provided by GitHub.
   *
   * This is what Gemini will review.
   */
  patch?: string;

  /**
   * Previous file name (only for renamed files).
   */
  previousFilename?: string;
}

/**
 * Metadata describing the pull request.
 */
export interface PRMetadata {
  /**
   * Pull request number.
   */
  number: number;

  /**
   * Pull request title.
   */
  title: string;

  /**
   * Pull request description/body.
   */
  body: string;

  /**
   * Author username.
   */
  author: string;

  /**
   * Base branch.
   */
  baseBranch: string;

  /**
   * Head branch.
   */
  headBranch: string;

  /**
   * Number of commits.
   */
  commits: number;

  /**
   * Total additions.
   */
  additions: number;

  /**
   * Total deletions.
   */
  deletions: number;

  /**
   * Number of changed files.
   */
  changedFiles: number;

  /**
   * Pull request state.
   */
  state: "open" | "closed";

  /**
   * Whether the PR has been merged.
   */
  merged: boolean;

  /**
   * GitHub URL.
   */
  url: string;
}

/**
 * Complete context required for AI pull request reviews.
 */
export interface PRContext {
  /**
   * Repository owner.
   */
  owner: string;

  /**
   * Repository name.
   */
  repository: string;

  /**
   * Pull request metadata.
   */
  metadata: PRMetadata;

  /**
   * Files changed in the PR.
   */
  files: PRFile[];
}
