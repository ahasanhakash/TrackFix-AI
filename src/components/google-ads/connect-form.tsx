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

export function GoogleAdsConnectForm({ orgSlug }: { orgSlug: string }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await fetch(`/api/organizations/${orgSlug}/google-ads/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mccId: formData.get("mccId"),
          name: formData.get("name"),
        }),
      });
      window.location.reload();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect MCC</CardTitle>
        <CardDescription>Link your Google Ads manager account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account label</Label>
            <Input id="name" name="name" required placeholder="Main MCC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mccId">MCC Customer ID</Label>
            <Input id="mccId" name="mccId" required placeholder="123-456-7890" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Connecting..." : "Connect MCC"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
