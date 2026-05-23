import { db } from "@/lib/db";
import { isWithinLimit } from "@/config/plans";
import type { CreateGtmContainerInput } from "@/lib/validations/gtm";
import type { PlanTier } from "@prisma/client";
import { AutomationJobService } from "@/services/jobs/automation-job.service";

export class GtmService {
  static async listContainers(organizationId: string) {
    return db.gtmContainer.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: { property: true },
    });
  }

  static async createContainer(
    organizationId: string,
    plan: PlanTier,
    input: CreateGtmContainerInput
  ) {
    const count = await db.gtmContainer.count({ where: { organizationId } });
    if (!isWithinLimit(plan, "gtmContainers", count)) {
      throw new Error("GTM container limit reached for your plan");
    }

    const job = await AutomationJobService.create(
      organizationId,
      "gtm",
      "create_container",
      input
    );

    const container = await db.gtmContainer.create({
      data: {
        organizationId,
        propertyId: input.propertyId,
        name: input.name,
        ga4Installed: input.ga4Installed,
        conversionTracking: input.conversionTracking,
        callTracking: input.callTracking,
        formTracking: input.formTracking,
        ecommerceTracking: input.ecommerceTracking,
        serverSideTagging: input.serverSideTagging,
        status: "PROVISIONING",
      },
    });

    // Stub: Google Tag Manager API integration runs async in production
    await AutomationJobService.updateStatus(job.id, "COMPLETED", {
      containerId: container.id,
      message: "Container queued for provisioning",
    });

    await db.gtmContainer.update({
      where: { id: container.id },
      data: { status: "ACTIVE", publicId: `GTM-${container.id.slice(-6).toUpperCase()}` },
    });

    return container;
  }

  static async provisionGa4(containerId: string) {
    await db.gtmContainer.findUniqueOrThrow({
      where: { id: containerId },
    });

    return db.gtmContainer.update({
      where: { id: containerId },
      data: { ga4Installed: true },
    });
  }
}
