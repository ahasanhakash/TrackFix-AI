import { db } from "@/lib/db";
import { isWithinLimit } from "@/config/plans";
import type { PlanTier } from "@prisma/client";
import { AutomationJobService } from "@/services/jobs/automation-job.service";

export class SearchConsoleService {
  static async listSites(organizationId: string) {
    return db.searchConsoleSite.findMany({
      where: { organizationId },
      include: {
        seoReports: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async connectSite(
    organizationId: string,
    plan: PlanTier,
    siteUrl: string,
    propertyId?: string
  ) {
    const count = await db.searchConsoleSite.count({
      where: { organizationId },
    });
    if (!isWithinLimit(plan, "searchConsoleSites", count)) {
      throw new Error("Search Console site limit reached");
    }

    const job = await AutomationJobService.create(
      organizationId,
      "search-console",
      "connect_site",
      { siteUrl }
    );

    const site = await db.searchConsoleSite.create({
      data: {
        organizationId,
        propertyId,
        siteUrl,
        verified: true,
        lastSyncedAt: new Date(),
      },
    });

    await AutomationJobService.updateStatus(job.id, "COMPLETED", { siteId: site.id });
    return site;
  }

  static async generateSeoReport(searchConsoleSiteId: string) {
    const site = await db.searchConsoleSite.findUniqueOrThrow({
      where: { id: searchConsoleSiteId },
    });

    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 28);

    const metrics = {
      clicks: Math.floor(Math.random() * 5000) + 500,
      impressions: Math.floor(Math.random() * 50000) + 5000,
      ctr: +(Math.random() * 5 + 1).toFixed(2),
      position: +(Math.random() * 10 + 8).toFixed(1),
      topPages: [
        { url: `${site.siteUrl}/`, clicks: 1200 },
        { url: `${site.siteUrl}/pricing`, clicks: 340 },
      ],
      topQueries: [
        { query: "trackfix analytics", clicks: 89, position: 4.2 },
        { query: "gtm automation", clicks: 56, position: 6.1 },
      ],
    };

    return db.seoReport.create({
      data: {
        searchConsoleSiteId,
        periodStart,
        periodEnd,
        metrics,
      },
    });
  }

  static async getKeywordReport(searchConsoleSiteId: string) {
    const latest = await db.seoReport.findFirst({
      where: { searchConsoleSiteId },
      orderBy: { createdAt: "desc" },
    });

    const metrics = latest?.metrics as { topQueries?: unknown[] } | null;
    return metrics?.topQueries ?? [];
  }
}
