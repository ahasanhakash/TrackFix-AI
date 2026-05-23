"use server";

import { requireOrganization } from "@/lib/session";
import { createGtmContainerSchema } from "@/lib/validations/gtm";
import { GtmService } from "@/services/gtm/gtm.service";
import { revalidatePath } from "next/cache";

export async function createGtmContainerAction(
  orgSlug: string,
  formData: FormData
) {
  const { organization, plan } = await requireOrganization(orgSlug);

  const parsed = createGtmContainerSchema.safeParse({
    name: formData.get("name"),
    propertyId: formData.get("propertyId") || undefined,
    ga4Installed: formData.get("ga4Installed") === "on",
    conversionTracking: formData.get("conversionTracking") === "on",
    callTracking: formData.get("callTracking") === "on",
    formTracking: formData.get("formTracking") === "on",
    ecommerceTracking: formData.get("ecommerceTracking") === "on",
    serverSideTagging: formData.get("serverSideTagging") === "on",
  });

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  try {
    await GtmService.createContainer(organization.id, plan, parsed.data);
    revalidatePath(`/dashboard/${orgSlug}/gtm`);
  } catch (e) {
    throw new Error(
      e instanceof Error ? e.message : "Failed to create container"
    );
  }
}
