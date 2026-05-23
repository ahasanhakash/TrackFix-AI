import type { NextRequest } from "next/server";

type UrlSource = NextRequest | { nextUrl: URL } | URL | Headers;

/**
 * Resolves a safe absolute origin for redirects and Auth.js.
 * Never returns an empty string.
 */
export function getBaseUrl(request?: UrlSource): string {
  const fromEnv = pickEnvBaseUrl();
  if (fromEnv) return fromEnv;

  if (request) {
    const origin = resolveRequestOrigin(request);
    if (origin) return origin;
  }

  return "http://localhost:3000";
}

function pickEnvBaseUrl(): string | null {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];

  for (const raw of candidates) {
    const normalized = normalizeBaseUrl(raw);
    if (normalized) return normalized;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    return normalizeBaseUrl(`https://${vercelHost}`);
  }

  return null;
}

function normalizeBaseUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;

  let value = raw.trim();
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value.replace(/^\/+/, "")}`;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

function resolveRequestOrigin(request: UrlSource): string | null {
  if (request instanceof URL) {
    return request.origin || null;
  }

  if ("nextUrl" in request && request.nextUrl?.origin) {
    return request.nextUrl.origin;
  }

  if (request instanceof Headers) {
    const host =
      request.get("x-forwarded-host") ?? request.get("host");
    const proto = request.get("x-forwarded-proto") ?? "https";
    if (host) {
      return normalizeBaseUrl(`${proto}://${host.split(",")[0]?.trim()}`);
    }
  }

  if ("nextUrl" in request) {
    const req = request as NextRequest;
    const host =
      req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    if (host) {
      return normalizeBaseUrl(`${proto}://${host.split(",")[0]?.trim()}`);
    }
  }

  return null;
}

/** Build an absolute URL from a path and base — never pass relative paths to `new URL(path)` alone. */
export function safeUrl(path: string, baseUrl: string): URL {
  const base = normalizeBaseUrl(baseUrl) ?? "http://localhost:3000";
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, `${base}/`);
}

export function getBaseUrlFromHeaders(headers: Headers): string {
  return getBaseUrl(headers);
}

/**
 * Auth.js calls `new URL(process.env.AUTH_URL)` in middleware when the var is set.
 * Remove or normalize invalid values (empty string, relative path, missing protocol).
 */
export function sanitizeAuthEnv(): void {
  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const raw = process.env[key];
    if (!raw?.trim()) {
      delete process.env[key];
      continue;
    }

    const normalized = normalizeBaseUrl(raw);
    if (normalized) {
      process.env[key] = normalized;
    } else {
      delete process.env[key];
    }
  }
}
