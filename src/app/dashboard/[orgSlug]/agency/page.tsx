import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireOrganization } from "@/lib/session";
import { AgencyService } from "@/services/agency/agency.service";
import { PLAN_LIMITS } from "@/config/plans";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization, plan } = await requireOrganization(orgSlug);
  const isAgency = AgencyService.isAgencyPlan(plan);
  const properties = await AgencyService.listClientProperties(organization.id);
  const members = await AgencyService.listTeamMembers(organization.id);
  const limits = PLAN_LIMITS[plan];

  return (
    <>
      <DashboardHeader
        title="Agency dashboard"
        description="Clients, team, and workspace limits"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current plan</CardDescription>
              <CardTitle>{plan}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Client properties</CardDescription>
              <CardTitle>{properties.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Team members</CardDescription>
              <CardTitle>
                {members.length} /{" "}
                {limits.teamMembers === Infinity ? "∞" : limits.teamMembers}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {!isAgency && (
          <Card className="border-dashed">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              Upgrade to Agency for unlimited client workspaces and white-label options.
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Client properties</CardTitle>
            <CardDescription>Websites managed in this workspace</CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No client properties yet.</p>
            ) : (
              <ul className="space-y-2">
                {properties.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-muted-foreground">{p.domain}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline">{p.gtmContainers.length} GTM</Badge>
                      <Badge variant="outline">{p.ga4Properties.length} GA4</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={m.user.image ?? undefined} />
                    <AvatarFallback>
                      {m.user.name?.[0] ?? m.user.email?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.user.name ?? m.user.email}</p>
                    <p className="text-xs text-muted-foreground">{m.user.email}</p>
                  </div>
                  <Badge variant="secondary">{m.role}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
