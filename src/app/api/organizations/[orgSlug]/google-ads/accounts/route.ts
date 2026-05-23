import { NextResponse } from "next/server";
import { requireOrganization } from "@/lib/session";
import { GoogleAdsService } from "@/services/google-ads/google-ads.service";
import { z } from "zod";

const bodySchema = z.object({
  mccId: z.string().min(3),
  name: z.string().min(2),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    const { orgSlug } = await params;
    const { organization, plan } = await requireOrganization(orgSlug);
    const body = bodySchema.parse(await request.json());
    const account = await GoogleAdsService.connectMcc(
      organization.id,
      plan,
      body.mccId,
      body.name
    );
    return NextResponse.json(account, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to connect account";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
