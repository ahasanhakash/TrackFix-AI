import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth/server-session";
import type { Organization, OrganizationMember, PlanTier, User } from "@prisma/client";

export type SessionUser = User & {
  memberships: (OrganizationMember & { organization: Organization })[];
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSessionFromCookies();
  if (!session?.userId) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      memberships: {
        include: { organization: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getActiveOrganization(
  user: SessionUser,
  orgSlug?: string
): Promise<Organization | null> {
  if (orgSlug) {
    const membership = user.memberships.find(
      (m) => m.organization.slug === orgSlug
    );
    return membership?.organization ?? null;
  }
  return user.memberships[0]?.organization ?? null;
}

export async function requireOrganization(
  orgSlug: string
): Promise<{ user: SessionUser; organization: Organization; plan: PlanTier }> {
  const user = await requireUser();
  const organization = await getActiveOrganization(user, orgSlug);
  if (!organization) redirect("/onboarding");
  return { user, organization, plan: organization.plan };
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("trackfix-session");
}
