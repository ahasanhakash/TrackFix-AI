import type { NextAuthConfig } from "next-auth";

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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isProtected =
        pathname.startsWith("/dashboard") || pathname === "/onboarding";

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
