import { NextResponse } from "next/server";
import { requireOrganization } from "@/lib/session";
import { SearchConsoleService } from "@/services/search-console/search-console.service";
import { z } from "zod";

const bodySchema = z.object({ siteUrl: z.string().url() });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    const { orgSlug } = await params;
    const { organization, plan } = await requireOrganization(orgSlug);
    const body = bodySchema.parse(await request.json());
    const site = await SearchConsoleService.connectSite(
      organization.id,
      plan,
      body.siteUrl
    );
    return NextResponse.json(site, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to connect site";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
