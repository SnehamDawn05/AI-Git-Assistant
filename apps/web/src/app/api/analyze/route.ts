import { NextRequest, NextResponse } from "next/server";

import {
  analysisQueue,
  JobType,
  type AnalysisJobData,
} from "@repo/queue/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.repositoryUrl) {
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

    if (!Object.values(JobType).includes(body.type)) {
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

    if (body.type === JobType.REVIEW && !body.pullRequestUrl) {
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

      repositoryUrl: body.repositoryUrl,
      pullRequestUrl: body.pullRequestUrl || undefined,
      type: body.type,
    };

    const job = await analysisQueue.add(data.type, data);

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
