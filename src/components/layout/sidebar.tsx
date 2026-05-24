"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  orgSlug: string;
  plan: string;
}

export function Sidebar({ orgSlug, plan }: SidebarProps) {
  const pathname = usePathname();
  const base = `/dashboard/${orgSlug}`;

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={base} className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {dashboardNav.map((item) => {
          const href =
            "absolute" in item && item.absolute
              ? item.href
              : `${base}${item.href}`;
          const active =
            "absolute" in item && item.absolute
              ? pathname.startsWith(item.href)
              : item.href === ""
                ? pathname === base
                : pathname.startsWith(href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Badge variant="secondary" className="w-full justify-center">
          {plan} Plan
        </Badge>
      </div>
    </aside>
  );
}
