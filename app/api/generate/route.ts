import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/generate`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Forward any cookies if needed for auth purposes
      // credentials: 'include',
    });

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
      { error: "Failed to fetch from backend service" },
      { status: 500 }
    );
  }
}
