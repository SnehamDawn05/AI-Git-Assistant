import { NextRequest, NextResponse } from "next/server";

import { listUserAnalyses } from "@repo/db";

import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const analyses = await listUserAnalyses(session.user.id);

    return NextResponse.json({
      success: true,
      analyses,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analyses.",
      },
      {
        status: 500,
      },
    );
  }
}
