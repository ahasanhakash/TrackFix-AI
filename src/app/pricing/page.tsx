import Link from "next/link";
import { PLAN_LIMITS, PLAN_PRICING } from "@/config/plans";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlanTier } from "@prisma/client";

const tiers: PlanTier[] = ["MVP", "PRO", "AGENCY"];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <Link href="/" className="font-semibold">
          {siteConfig.name}
        </Link>
        <Button asChild size="sm">
          <Link href="/login">Get started</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-2 text-muted-foreground">
            Start on MVP and upgrade as you scale clients and automations.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const pricing = PLAN_PRICING[tier];
            const limits = PLAN_LIMITS[tier];
            const featured = tier === "PRO";
            return (
              <Card
                key={tier}
                className={featured ? "border-primary shadow-lg" : ""}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{pricing.label}</CardTitle>
                    {featured && <Badge>Popular</Badge>}
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      ${pricing.monthly}
                    </span>
                    /mo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>GTM containers: {formatLimit(limits.gtmContainers)}</p>
                  <p>GA4 properties: {formatLimit(limits.ga4Properties)}</p>
                  <p>Google Ads: {formatLimit(limits.googleAdsAccounts)}</p>
                  <p>Search Console: {formatLimit(limits.searchConsoleSites)}</p>
                  <p>Team members: {formatLimit(limits.teamMembers)}</p>
                  {limits.serverSideTagging && <p>✓ Server-side tagging</p>}
                  {limits.aiAdCopy && <p>✓ AI ad copy</p>}
                  {limits.autoOptimization && <p>✓ Auto optimization</p>}
                  {tier === "AGENCY" && <p>✓ Client workspaces</p>}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={featured ? "default" : "outline"}>
                    <Link href="/login">Choose {pricing.label}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function formatLimit(n: number) {
  return n === Infinity ? "Unlimited" : String(n);
}
