"use client";

import { useTransition } from "react";
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

export function SearchConsoleConnectForm({ orgSlug }: { orgSlug: string }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await fetch(`/api/organizations/${orgSlug}/search-console/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl: formData.get("siteUrl") }),
      });
      window.location.reload();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect site</CardTitle>
        <CardDescription>Add a Search Console property</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              name="siteUrl"
              type="url"
              required
              placeholder="https://example.com"
            />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Connecting..." : "Connect site"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
