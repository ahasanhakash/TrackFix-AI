import { db } from "@/lib/db";
import type { JobStatus, Prisma } from "@prisma/client";

export class AutomationJobService {
  static async create(
    organizationId: string,
    module: string,
    action: string,
    input?: Prisma.InputJsonValue
  ) {
    return db.automationJob.create({
      data: {
        organizationId,
        module,
        action,
        input,
        status: "PENDING",
      },
    });
  }

  static async updateStatus(
    jobId: string,
    status: JobStatus,
    output?: Prisma.InputJsonValue,
    error?: string
  ) {
    return db.automationJob.update({
      where: { id: jobId },
      data: {
        status,
        output,
        error,
        startedAt: status === "RUNNING" ? new Date() : undefined,
        completedAt:
          status === "COMPLETED" || status === "FAILED" ? new Date() : undefined,
      },
    });
  }

  static async listByOrganization(organizationId: string, limit = 10) {
    return db.automationJob.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
