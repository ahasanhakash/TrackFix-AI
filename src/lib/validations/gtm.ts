import { z } from "zod";

export const createGtmContainerSchema = z.object({
  name: z.string().min(2).max(100),
  propertyId: z.string().cuid().optional(),
  ga4Installed: z.boolean().default(true),
  conversionTracking: z.boolean().default(false),
  callTracking: z.boolean().default(false),
  formTracking: z.boolean().default(false),
  ecommerceTracking: z.boolean().default(false),
  serverSideTagging: z.boolean().default(false),
});

export type CreateGtmContainerInput = z.infer<typeof createGtmContainerSchema>;
