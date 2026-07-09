import { JobType } from "./job-types";

export interface AnalysisJobData {
  analysisId: string;
  repositoryId: string;
  repositoryUrl: string;
  pullRequestUrl?: string;
  type: JobType;
}
