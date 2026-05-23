import { DashboardHeader } from "@/components/layout/dashboard-header";
import { createGtmContainerAction } from "@/app/actions/gtm";
import { requireOrganization } from "@/lib/session";
import { GtmService } from "@/services/gtm/gtm.service";
import { canUseFeature } from "@/config/plans";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function GtmPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization, plan } = await requireOrganization(orgSlug);
  const containers = await GtmService.listContainers(organization.id);
  const serverSideAllowed = canUseFeature(plan, "serverSideTagging");

  return (
    <>
      <DashboardHeader
        title="GTM Automation"
        description="Create containers and configure tracking in one flow"
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create container</CardTitle>
              <CardDescription>
                Auto-install GA4 and enable tracking modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createGtmContainerAction.bind(null, orgSlug)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Container name</Label>
                  <Input id="name" name="name" placeholder="Main Website" required />
                </div>
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">Tracking modules</legend>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="ga4Installed" defaultChecked />
                    Auto install GA4
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="conversionTracking" />
                    Conversion tracking
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="callTracking" />
                    Call tracking
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="formTracking" />
                    Form tracking
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="ecommerceTracking" />
                    Ecommerce tracking
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="serverSideTagging"
                      disabled={!serverSideAllowed}
                    />
                    Server-side tagging
                    {!serverSideAllowed && (
                      <span className="text-xs text-muted-foreground">(Pro+)</span>
                    )}
                  </label>
                </fieldset>
                <Button type="submit">Create & provision</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Containers</CardTitle>
              <CardDescription>{containers.length} total</CardDescription>
            </CardHeader>
            <CardContent>
              {containers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No containers yet.</p>
              ) : (
                <ul className="space-y-3">
                  {containers.map((c) => (
                    <li key={c.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.name}</span>
                        <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>
                          {c.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.publicId ?? "Provisioning..."}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.ga4Installed && <Badge variant="outline">GA4</Badge>}
                        {c.conversionTracking && <Badge variant="outline">Conversions</Badge>}
                        {c.callTracking && <Badge variant="outline">Calls</Badge>}
                        {c.formTracking && <Badge variant="outline">Forms</Badge>}
                        {c.ecommerceTracking && <Badge variant="outline">Ecommerce</Badge>}
                        {c.serverSideTagging && <Badge variant="outline">sGTM</Badge>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
