import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session-token";
import { safeUrl, getBaseUrl } from "@/lib/base-url";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/connect"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const baseUrl = getBaseUrl(request);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  let isLoggedIn = false;

  if (token) {
    const session = await verifySessionToken(token);
    isLoggedIn = !!session;
  }

  if (isProtected && !isLoggedIn) {
    const loginUrl = safeUrl("/login", baseUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(safeUrl("/dashboard", baseUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/login",
    "/connect/:path*",
  ],
};
