import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: {
    excuseId: string;
  };
}

export async function POST(request: NextRequest, context: Context) {
  const { params } = context;
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const excuseId = params.excuseId;

    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    // Get the request body (vote direction)
    const body = await request.json();

    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/excuses/${excuseId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        errorData || { error: "Backend service error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to submit vote to backend service" },
      { status: 500 }
    );
  }
}
