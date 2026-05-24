import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { siteConfig } from "@/config/site";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to {siteConfig.name}</CardTitle>
          <CardDescription>
            Sign in to access your dashboard. Google marketing tools are connected
            separately after login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignInButton />
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
