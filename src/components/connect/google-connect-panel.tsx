import {
  BarChart3,
  Globe,
  Megaphone,
  ShieldAlert,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const scopeCards = [
  {
    icon: Tags,
    title: "Google Tag Manager",
    description:
      "Create containers, publish tags, and manage server-side tagging for your properties.",
    scopes: "tagmanager.edit.containers, tagmanager.publish",
  },
  {
    icon: BarChart3,
    title: "Google Analytics 4",
    description:
      "Create properties, configure events, conversions, audiences, and reporting.",
    scopes: "analytics.edit",
  },
  {
    icon: Megaphone,
    title: "Google Ads",
    description:
      "Connect MCC accounts, manage campaigns, keywords, and optimization workflows.",
    scopes: "adwords",
  },
  {
    icon: Globe,
    title: "Search Console",
    description:
      "Verify sites and pull SEO performance, keyword, and indexing reports.",
    scopes: "webmasters.readonly",
  },
];

const mockAccounts = [
  {
    email: "agency@example.com",
    services: "GTM, GA4, Ads, Search Console",
    status: "Pending Google verification",
    connectedAt: "—",
  },
];

export function GoogleConnectPanel() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Connect Google Account
          </h1>
          <Badge variant="warning">Pending Google verification</Badge>
        </div>
        <p className="text-muted-foreground">
          Link Google marketing APIs separately from your login. This flow
          requests advanced scopes only when you are ready to automate GTM,
          GA4, Google Ads, and Search Console.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="flex flex-row items-start gap-3 pb-2">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <CardTitle className="text-base">Verification required</CardTitle>
            <CardDescription>
              TrackFix must be verified by Google before OAuth scopes can be
              granted in production. Until verification completes, connections
              remain in pending state and API automations are disabled.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Start Google integration</CardTitle>
          <CardDescription>
            Uses a dedicated OAuth flow — not your Firebase login session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled title="Available after Google OAuth verification">
            Connect Google Account
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Button will activate once Google Cloud OAuth verification is
            approved for production.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Scopes requested per service</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {scopeCards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <card.icon className="mb-2 h-6 w-6 text-primary" />
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {card.scopes}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Connected accounts</CardTitle>
          <CardDescription>
            Preview of accounts linked via the Google integration flow
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Google account</th>
                <th className="pb-2 font-medium">Services</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Connected</th>
              </tr>
            </thead>
            <tbody>
              {mockAccounts.map((row) => (
                <tr key={row.email} className="border-b last:border-0">
                  <td className="py-3">{row.email}</td>
                  <td className="py-3">{row.services}</td>
                  <td className="py-3">
                    <Badge variant="warning">{row.status}</Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {row.connectedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
