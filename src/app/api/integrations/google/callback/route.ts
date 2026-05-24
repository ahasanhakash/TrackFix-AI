import { NextResponse } from "next/server";

/**
 * Placeholder for Google integration OAuth callback.
 * Activated when GOOGLE_INTEGRATION_* env vars are configured post-verification.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "pending",
      message: "Google integration OAuth is not yet enabled. Complete Google verification first.",
    },
    { status: 501 }
  );
}
