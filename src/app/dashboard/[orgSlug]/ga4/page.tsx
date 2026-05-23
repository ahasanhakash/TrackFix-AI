import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireOrganization } from "@/lib/session";
import { Ga4Service } from "@/services/ga4/ga4.service";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ga4CreatePropertyForm } from "@/components/ga4/create-property-form";

export default async function Ga4Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization } = await requireOrganization(orgSlug);
  const properties = await Ga4Service.listProperties(organization.id);
  const metrics = await Ga4Service.getDashboardMetrics(organization.id);

  return (
    <>
      <DashboardHeader
        title="GA4 Automation"
        description="Properties, events, conversions, audiences, and reports"
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Ga4CreatePropertyForm orgSlug={orgSlug} />
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Report dashboard</CardTitle>
              <CardDescription>Property-level metrics snapshot</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics.length === 0 ? (
                <p className="text-sm text-muted-foreground">No properties yet.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {metrics.map((m) => (
                    <div key={m.id} className="rounded-lg border p-4">
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.measurementId}</p>
                      <div className="mt-2 flex gap-2 text-sm">
                        <Badge variant="outline">{m.events} events</Badge>
                        <Badge variant="outline">{m.conversions} conversions</Badge>
                        <Badge variant="outline">{m.audiences} audiences</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="text-sm text-muted-foreground">Create your first GA4 property.</p>
            ) : (
              <ul className="space-y-2">
                {properties.map((p) => (
                  <li key={p.id} className="flex justify-between rounded-lg border p-3 text-sm">
                    <span>{p.name}</span>
                    <span className="text-muted-foreground">{p.measurementId}</span>
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
