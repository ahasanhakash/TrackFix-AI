import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireOrganization } from "@/lib/session";
import { SearchConsoleService } from "@/services/search-console/search-console.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchConsoleConnectForm } from "@/components/search-console/connect-form";

export default async function SearchConsolePage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization } = await requireOrganization(orgSlug);
  const sites = await SearchConsoleService.listSites(organization.id);

  return (
    <>
      <DashboardHeader
        title="Search Console"
        description="Site connect, SEO reports, and keyword performance"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <SearchConsoleConnectForm orgSlug={orgSlug} />
          <Card>
            <CardHeader>
              <CardTitle>Connected sites</CardTitle>
            </CardHeader>
            <CardContent>
              {sites.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sites connected.</p>
              ) : (
                <ul className="space-y-3">
                  {sites.map((s) => (
                    <li key={s.id} className="rounded-lg border p-3">
                      <div className="flex justify-between">
                        <span className="font-medium truncate">{s.siteUrl}</span>
                        <Badge variant={s.verified ? "success" : "warning"}>
                          {s.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      {s.seoReports[0] && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Last report: {s.seoReports[0].periodStart.toLocaleDateString()} –{" "}
                          {s.seoReports[0].periodEnd.toLocaleDateString()}
                        </p>
                      )}
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
