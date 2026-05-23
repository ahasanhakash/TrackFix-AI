import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireOrganization } from "@/lib/session";
import { AgencyService } from "@/services/agency/agency.service";
import { BarChart3, Globe, Megaphone, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization } = await requireOrganization(orgSlug);
  const overview = await AgencyService.getWorkspaceOverview(organization.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description={`Workspace: ${organization.name}`}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="GTM Containers"
            value={overview.gtmCount}
            icon={Tags}
          />
          <StatCard
            title="GA4 Properties"
            value={overview.ga4Count}
            icon={BarChart3}
          />
          <StatCard
            title="Google Ads"
            value={overview.adsCount}
            icon={Megaphone}
          />
          <StatCard
            title="Search Console"
            value={overview.gscCount}
            icon={Globe}
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent automation jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {overview.recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No jobs yet. Create a GTM container or connect an integration to get started.
              </p>
            ) : (
              <ul className="space-y-3">
                {overview.recentJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <span className="font-medium">{job.module}</span>
                      <span className="text-muted-foreground"> · {job.action}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          job.status === "COMPLETED"
                            ? "success"
                            : job.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {job.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
