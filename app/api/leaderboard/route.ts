import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // Get the timeframe query parameter
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week";

    // Forward the request to the backend with the query parameter
    const response = await fetch(
      `${backendUrl}/api/leaderboard?timeframe=${timeframe}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Backend service error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data from backend service" },
      { status: 500 }
    );
  }
}
