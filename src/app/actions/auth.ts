"use server";

import { headers } from "next/headers";
import { signOut } from "@/lib/auth";
import { getBaseUrlFromHeaders, safeUrl } from "@/lib/base-url";

export async function signOutAction() {
  const requestHeaders = await headers();
  const baseUrl = getBaseUrlFromHeaders(requestHeaders);
  const redirectTo = safeUrl("/", baseUrl).toString();
  await signOut({ redirectTo });
}
