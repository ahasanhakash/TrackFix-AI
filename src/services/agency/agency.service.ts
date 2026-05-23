import { db } from "@/lib/db";
import type { PlanTier } from "@prisma/client";

export class AgencyService {
  static async getWorkspaceOverview(organizationId: string) {
    const [
      gtmCount,
      ga4Count,
      adsCount,
      gscCount,
      memberCount,
      recentJobs,
    ] = await Promise.all([
      db.gtmContainer.count({ where: { organizationId } }),
      db.ga4Property.count({ where: { organizationId } }),
      db.googleAdsAccount.count({ where: { organizationId } }),
      db.searchConsoleSite.count({ where: { organizationId } }),
      db.organizationMember.count({ where: { organizationId } }),
      db.automationJob.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      gtmCount,
      ga4Count,
      adsCount,
      gscCount,
      memberCount,
      recentJobs,
    };
  }

  static async listClientProperties(organizationId: string) {
    return db.property.findMany({
      where: { organizationId },
      include: {
        gtmContainers: true,
        ga4Properties: true,
        searchConsoleSites: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async listTeamMembers(organizationId: string) {
    return db.organizationMember.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
  }

  static isAgencyPlan(plan: PlanTier) {
    return plan === "AGENCY";
  }
}
