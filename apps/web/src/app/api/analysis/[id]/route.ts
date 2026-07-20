import { NextRequest, NextResponse } from "next/server";

import { getUserAnalysis } from "@repo/db";

import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const analysis = await getUserAnalysis(session.user.id, id);

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          message: "Analysis not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analysis.",
      },
      {
        status: 500,
      },
    );
  }
}
