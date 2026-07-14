import { NextRequest, NextResponse } from "next/server";

import {
  analysisQueue,
  JobType,
  type AnalysisJobData,
} from "@repo/queue/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const repositoryUrl = body.repositoryUrl?.trim() ?? "";

    const pullRequestUrl = body.pullRequestUrl?.trim() ?? "";

    const type = body.type as JobType;

    // ---------------------------------------
    // Validate analysis type
    // ---------------------------------------

    if (!Object.values(JobType).includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid analysis type.",
        },
        {
          status: 400,
        },
      );
    }

    // ---------------------------------------
    // Repository URL required for
    // SUMMARY and README only
    // ---------------------------------------

    if (type !== JobType.REVIEW && !repositoryUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Repository URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    // ---------------------------------------
    // Pull Request URL required for REVIEW
    // ---------------------------------------

    if (type === JobType.REVIEW && !pullRequestUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Pull Request URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    const data: AnalysisJobData = {
      analysisId: crypto.randomUUID(),

      repositoryId: crypto.randomUUID(),

      // Worker derives the repository URL
      // from the PR URL for REVIEW jobs.
      repositoryUrl: repositoryUrl || "",

      pullRequestUrl: pullRequestUrl || undefined,

      type,
    };

    const job = await analysisQueue.add(type, data);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Analysis queued successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to queue analysis.",
      },
      {
        status: 500,
      },
    );
  }
}
