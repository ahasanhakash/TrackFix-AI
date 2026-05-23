import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions/auth";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export async function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {session?.user?.email}
        </span>
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback>
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
