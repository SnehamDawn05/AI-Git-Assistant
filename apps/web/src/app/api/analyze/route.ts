import { NextRequest, NextResponse } from "next/server";

import { createAnalysis, upsertRepository } from "@repo/db";

import { parsePullRequestUrl } from "@repo/github";

import {
  analysisQueue,
  JobType,
  type AnalysisJobData,
} from "@repo/queue/server";

import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // ---------------------------------------
    // Authentication
    // ---------------------------------------

    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    const type = body.type as JobType;

    let repositoryUrl = body.repositoryUrl?.trim() ?? "";

    const pullRequestUrl = body.pullRequestUrl?.trim() ?? "";

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
    // PR Review requires PR URL
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

    // ---------------------------------------
    // Determine Repository
    // ---------------------------------------

    let owner = "";
    let repository = "";

    if (type === JobType.REVIEW) {
      const parsed = parsePullRequestUrl(pullRequestUrl);

      owner = parsed.owner;
      repository = parsed.repository;

      repositoryUrl = `https://github.com/${owner}/${repository}`;
    } else {
      if (!repositoryUrl) {
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

      const match = repositoryUrl.match(
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/,
      );

      if (!match) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid GitHub repository URL.",
          },
          {
            status: 400,
          },
        );
      }

      owner = match[1];
      repository = match[2];
    }

    // ---------------------------------------
    // Repository
    // ---------------------------------------

    const repositoryRecord = await upsertRepository({
      userId: session.user.id,
      githubUrl: repositoryUrl,
      owner,
      name: repository,
    });

    // ---------------------------------------
    // Analysis
    // ---------------------------------------

    const analysis = await createAnalysis({
      userId: session.user.id,
      repositoryId: repositoryRecord.id,
      type,
    });

    // ---------------------------------------
    // Queue Job
    // ---------------------------------------

    const job: AnalysisJobData = {
      analysisId: analysis.id,

      repositoryId: repositoryRecord.id,

      repositoryUrl,

      pullRequestUrl: pullRequestUrl || undefined,

      type,
    };

    await analysisQueue.add(type, job);

    return NextResponse.json({
      success: true,

      analysisId: analysis.id,

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
