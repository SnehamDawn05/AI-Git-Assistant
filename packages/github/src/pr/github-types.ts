export interface GitHubPullRequestResponse {
  number: number;
  title: string;
  body: string | null;

  html_url: string;

  state: "open" | "closed";

  merged: boolean;

  additions: number;
  deletions: number;

  changed_files: number;

  commits: number;

  user: {
    login: string;
  };

  base: {
    ref: string;
  };

  head: {
    ref: string;
  };
}

export interface GitHubPullRequestFileResponse {
  filename: string;

  status: "added" | "modified" | "removed" | "renamed";

  additions: number;

  deletions: number;

  patch?: string;

  previous_filename?: string;
}
