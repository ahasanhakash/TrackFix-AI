import { requireUser } from "@/lib/session";
import { createOrganizationAction } from "@/app/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function OnboardingPage() {
  await requireUser();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your workspace</CardTitle>
          <CardDescription>
            Set up an organization to start automating GTM, GA4, Ads, and SEO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createOrganizationAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme Marketing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Workspace URL slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="acme-marketing"
                pattern="[a-z0-9-]+"
                required
              />
              <p className="text-xs text-muted-foreground">
                Used in your dashboard URL: /dashboard/your-slug
              </p>
            </div>
            <Button type="submit" className="w-full">
              Create workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
