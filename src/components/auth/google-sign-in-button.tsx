"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Contact support.");
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      // Basic login only — email and profile. No Google Ads/GTM/GA4 scopes.
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Sign in failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full"
        size="lg"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </Button>
      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Sign in uses your Google email and profile only. Connect Google Ads,
        GTM, and Analytics separately after login.
      </p>
    </div>
  );
}
