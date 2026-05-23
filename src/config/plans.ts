import type { PlanTier } from "@prisma/client";

export interface PlanLimits {
  gtmContainers: number;
  ga4Properties: number;
  googleAdsAccounts: number;
  searchConsoleSites: number;
  teamMembers: number;
  clientWorkspaces: number;
  serverSideTagging: boolean;
  aiAdCopy: boolean;
  autoOptimization: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  MVP: {
    gtmContainers: 1,
    ga4Properties: 1,
    googleAdsAccounts: 0,
    searchConsoleSites: 1,
    teamMembers: 1,
    clientWorkspaces: 0,
    serverSideTagging: false,
    aiAdCopy: false,
    autoOptimization: false,
  },
  PRO: {
    gtmContainers: 10,
    ga4Properties: 10,
    googleAdsAccounts: 3,
    searchConsoleSites: 5,
    teamMembers: 5,
    clientWorkspaces: 0,
    serverSideTagging: true,
    aiAdCopy: true,
    autoOptimization: true,
  },
  AGENCY: {
    gtmContainers: Infinity,
    ga4Properties: Infinity,
    googleAdsAccounts: Infinity,
    searchConsoleSites: Infinity,
    teamMembers: Infinity,
    clientWorkspaces: Infinity,
    serverSideTagging: true,
    aiAdCopy: true,
    autoOptimization: true,
  },
};

export const PLAN_PRICING = {
  MVP: { monthly: 49, label: "MVP" },
  PRO: { monthly: 149, label: "Pro" },
  AGENCY: { monthly: 399, label: "Agency" },
} as const;

export function canUseFeature(
  plan: PlanTier,
  feature: keyof PlanLimits
): boolean {
  const limits = PLAN_LIMITS[plan];
  const value = limits[feature];
  if (typeof value === "boolean") return value;
  return value > 0;
}

export function isWithinLimit(
  plan: PlanTier,
  feature: keyof Omit<PlanLimits, "serverSideTagging" | "aiAdCopy" | "autoOptimization">,
  currentCount: number
): boolean {
  const limit = PLAN_LIMITS[plan][feature];
  if (limit === Infinity) return true;
  return currentCount < limit;
}
