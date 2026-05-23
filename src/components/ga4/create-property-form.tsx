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

interface Ga4CreatePropertyFormProps {
  orgSlug: string;
}

export function Ga4CreatePropertyForm({ orgSlug }: Ga4CreatePropertyFormProps) {
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await fetch(`/api/organizations/${orgSlug}/ga4/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name") }),
      });
      window.location.reload();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create property</CardTitle>
        <CardDescription>Provision a new GA4 property</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ga4-name">Property name</Label>
            <Input id="ga4-name" name="name" required placeholder="Production Site" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
