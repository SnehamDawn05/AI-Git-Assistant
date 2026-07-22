import { JobType } from "./job-types.js";

export interface AnalysisJobData {
  analysisId: string;
  repositoryId: string;

  owner: string;
  repository: string;

  repositoryUrl: string;
  pullRequestUrl?: string;

  type: JobType;
}
