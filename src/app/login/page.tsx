import Link from "next/link";
import { headers } from "next/headers";
import { signIn } from "@/lib/auth";
import { getBaseUrlFromHeaders, safeUrl } from "@/lib/base-url";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function signInWithGoogle() {
  "use server";
  const requestHeaders = await headers();
  const baseUrl = getBaseUrlFromHeaders(requestHeaders);
  const redirectTo = safeUrl("/dashboard", baseUrl).toString();
  await signIn("google", { redirectTo });
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to {siteConfig.name}</CardTitle>
          <CardDescription>
            Sign in with Google to connect Analytics, GTM, Ads, and Search Console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={signInWithGoogle}>
            <Button type="submit" className="w-full" size="lg">
              Continue with Google
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our terms and privacy policy.
          </p>
          <p className="text-center text-sm">
            <Link href="/" className="text-primary hover:underline">
              ← Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
