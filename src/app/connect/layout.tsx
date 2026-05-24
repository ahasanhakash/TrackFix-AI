import Link from "next/link";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/config/site";
import { signOutAction } from "@/app/actions/auth";

export default async function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <Link href="/dashboard" className="font-semibold">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{user.email}</span>
          <Link href="/dashboard" className="text-primary hover:underline">
            Dashboard
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
