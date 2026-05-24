import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth/session-token";

const bodySchema = z.object({
  idToken: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 503 }
      );
    }

    const body = bodySchema.parse(await request.json());
    const decoded = await getFirebaseAdminAuth().verifyIdToken(body.idToken);

    if (!decoded.email) {
      return NextResponse.json(
        { error: "Google account must include an email address" },
        { status: 400 }
      );
    }

    const user = await db.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        name: decoded.name ?? undefined,
        email: decoded.email,
        image: decoded.picture ?? undefined,
        emailVerified: decoded.email_verified ? new Date() : undefined,
      },
      create: {
        firebaseUid: decoded.uid,
        name: decoded.name ?? null,
        email: decoded.email,
        image: decoded.picture ?? null,
        emailVerified: decoded.email_verified ? new Date() : null,
      },
    });

    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email ?? decoded.email,
    });

    const response = NextResponse.json({ ok: true, userId: user.id });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
