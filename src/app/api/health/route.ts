import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "trackfix-ai",
    timestamp: new Date().toISOString(),
  });
}
