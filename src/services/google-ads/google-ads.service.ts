import { db } from "@/lib/db";
import { canUseFeature, isWithinLimit } from "@/config/plans";
import type { PlanTier } from "@prisma/client";
import { AutomationJobService } from "@/services/jobs/automation-job.service";

export class GoogleAdsService {
  static async listAccounts(organizationId: string) {
    return db.googleAdsAccount.findMany({
      where: { organizationId },
      include: {
        campaigns: true,
        _count: { select: { negativeKeywords: true, optimizationRequests: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async connectMcc(
    organizationId: string,
    plan: PlanTier,
    mccId: string,
    name: string
  ) {
    if (!canUseFeature(plan, "googleAdsAccounts")) {
      throw new Error("Google Ads is not available on the MVP plan");
    }

    const count = await db.googleAdsAccount.count({ where: { organizationId } });
    if (!isWithinLimit(plan, "googleAdsAccounts", count)) {
      throw new Error("Google Ads account limit reached");
    }

    return db.googleAdsAccount.create({
      data: {
        organizationId,
        mccId,
        name,
        connected: true,
      },
    });
  }

  static async runCampaignAudit(adsAccountId: string) {
    const job = await AutomationJobService.create(
      (await db.googleAdsAccount.findUniqueOrThrow({ where: { id: adsAccountId } }))
        .organizationId,
      "google-ads",
      "campaign_audit",
      { adsAccountId }
    );

    const campaigns = await db.googleAdsCampaign.findMany({
      where: { adsAccountId },
    });

    const auditResults = campaigns.length
      ? campaigns.map((c) => ({
          id: c.id,
          name: c.name,
          auditScore: Math.floor(Math.random() * 30) + 70,
        }))
      : [
          {
            id: "stub",
            name: "Sample Search Campaign",
            auditScore: 82,
          },
        ];

    for (const result of auditResults) {
      if (result.id !== "stub") {
        await db.googleAdsCampaign.update({
          where: { id: result.id },
          data: { auditScore: result.auditScore, lastAuditedAt: new Date() },
        });
      }
    }

    await AutomationJobService.updateStatus(job.id, "COMPLETED", { auditResults });
    return auditResults;
  }

  static async addNegativeKeyword(
    adsAccountId: string,
    keyword: string,
    matchType = "BROAD"
  ) {
    return db.googleAdsNegativeKeyword.create({
      data: { adsAccountId, keyword, matchType, source: "search_term_analysis" },
    });
  }

  static async createOptimizationRequest(
    adsAccountId: string,
    type: string,
    title: string,
    description: string,
    payload?: object
  ) {
    return db.optimizationRequest.create({
      data: {
        adsAccountId,
        type,
        title,
        description,
        payload: payload ?? {},
        status: "PENDING_APPROVAL",
      },
    });
  }

  static async approveOptimization(requestId: string) {
    return db.optimizationRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
    });
  }

  static async rejectOptimization(requestId: string) {
    return db.optimizationRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
  }
}
