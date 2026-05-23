import { NextResponse } from "next/server";
import { requireOrganization } from "@/lib/session";
import { Ga4Service } from "@/services/ga4/ga4.service";
import { z } from "zod";

const bodySchema = z.object({ name: z.string().min(2) });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    const { orgSlug } = await params;
    const { organization, plan } = await requireOrganization(orgSlug);
    const body = bodySchema.parse(await request.json());
    const property = await Ga4Service.createProperty(
      organization.id,
      plan,
      body.name
    );
    return NextResponse.json(property, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create property";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
