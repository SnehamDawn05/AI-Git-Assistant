import { NextResponse } from "next/server";

import { analysisQueue, JobType, type AnalysisJobData } from "@repo/queue";

export async function POST() {
  const jobData: AnalysisJobData = {
    analysisId: crypto.randomUUID(),
    repositoryId: crypto.randomUUID(),
    repositoryUrl: "https://github.com/facebook/react",
    type: JobType.SUMMARY,
  };

  const job = await analysisQueue.add(JobType.SUMMARY, jobData);

  return NextResponse.json({
    success: true,
    jobId: job.id,
    message: "Job added to queue successfully",
  });
}
