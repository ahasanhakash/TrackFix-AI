import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireOrganization } from "@/lib/session";
import { GoogleAdsService } from "@/services/google-ads/google-ads.service";
import { canUseFeature } from "@/config/plans";
import { ModulePlaceholder } from "@/components/dashboard/module-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAdsConnectForm } from "@/components/google-ads/connect-form";

export default async function GoogleAdsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization, plan } = await requireOrganization(orgSlug);
  const adsEnabled = canUseFeature(plan, "googleAdsAccounts");

  if (!adsEnabled) {
    return (
      <>
        <DashboardHeader title="Google Ads" description="Upgrade to Pro to unlock" />
        <div className="p-6">
          <ModulePlaceholder
            title="Google Ads — Pro plan required"
            description="Connect MCC, run audits, and manage optimizations on Pro or Agency."
            features={[
              "Connect MCC",
              "Campaign audit",
              "Search term analysis",
              "Negative keywords",
              "Ad copy AI",
              "PMax assets",
              "Auto optimization approval",
            ]}
          />
        </div>
      </>
    );
  }

  const accounts = await GoogleAdsService.listAccounts(organization.id);

  return (
    <>
      <DashboardHeader
        title="Google Ads"
        description="MCC, audits, search terms, and optimization approvals"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <GoogleAdsConnectForm orgSlug={orgSlug} />
          <Card>
            <CardHeader>
              <CardTitle>Connected accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts connected.</p>
              ) : (
                <ul className="space-y-3">
                  {accounts.map((a) => (
                    <li key={a.id} className="rounded-lg border p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{a.name}</span>
                        <Badge variant={a.connected ? "success" : "secondary"}>
                          {a.connected ? "Connected" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">MCC: {a.mccId}</p>
                      <p className="mt-1 text-xs">
                        {a._count.negativeKeywords} negatives ·{" "}
                        {a._count.optimizationRequests} pending optimizations
                      </p>
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
