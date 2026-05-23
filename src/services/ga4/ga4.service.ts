import { db } from "@/lib/db";
import { isWithinLimit } from "@/config/plans";
import type { PlanTier } from "@prisma/client";
import { AutomationJobService } from "@/services/jobs/automation-job.service";

export class Ga4Service {
  static async listProperties(organizationId: string) {
    return db.ga4Property.findMany({
      where: { organizationId },
      include: {
        events: true,
        conversions: true,
        audiences: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createProperty(
    organizationId: string,
    plan: PlanTier,
    name: string,
    propertyId?: string
  ) {
    const count = await db.ga4Property.count({ where: { organizationId } });
    if (!isWithinLimit(plan, "ga4Properties", count)) {
      throw new Error("GA4 property limit reached for your plan");
    }

    const job = await AutomationJobService.create(
      organizationId,
      "ga4",
      "create_property",
      { name }
    );

    const ga4 = await db.ga4Property.create({
      data: {
        organizationId,
        propertyId,
        name,
        measurementId: `G-${Date.now().toString(36).toUpperCase()}`,
      },
    });

    await AutomationJobService.updateStatus(job.id, "COMPLETED", {
      ga4PropertyId: ga4.id,
    });

    return ga4;
  }

  static async createEvent(ga4PropertyId: string, name: string, parameters?: object) {
    return db.ga4Event.create({
      data: {
        ga4PropertyId,
        name,
        parameters: parameters ?? {},
      },
    });
  }

  static async createConversion(
    ga4PropertyId: string,
    name: string,
    eventName: string
  ) {
    return db.ga4Conversion.create({
      data: { ga4PropertyId, name, eventName },
    });
  }

  static async createAudience(
    ga4PropertyId: string,
    name: string,
    definition?: object
  ) {
    return db.ga4Audience.create({
      data: { ga4PropertyId, name, definition: definition ?? {} },
    });
  }

  static async getDashboardMetrics(organizationId: string) {
    const properties = await db.ga4Property.findMany({
      where: { organizationId },
      include: {
        _count: { select: { events: true, conversions: true, audiences: true } },
      },
    });

    return properties.map((p) => ({
      id: p.id,
      name: p.name,
      measurementId: p.measurementId,
      events: p._count.events,
      conversions: p._count.conversions,
      audiences: p._count.audiences,
    }));
  }
}
