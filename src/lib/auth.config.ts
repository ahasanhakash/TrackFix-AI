import type { NextAuthConfig } from "next-auth";
import { getBaseUrl, safeUrl } from "@/lib/base-url";

/**
 * Edge-safe Auth.js config — used by middleware only.
 * No Prisma, no providers, no database session callbacks.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const nextUrl = request.nextUrl;
      const pathname = nextUrl.pathname;
      const baseUrl = getBaseUrl(request);

      const isProtected =
        pathname.startsWith("/dashboard") || pathname === "/onboarding";

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (pathname === "/login" && isLoggedIn) {
        return Response.redirect(safeUrl("/dashboard", baseUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
