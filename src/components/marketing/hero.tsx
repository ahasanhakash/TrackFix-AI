import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
        Marketing analytics automation
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Fix tracking. Scale ads.{" "}
        <span className="text-primary">Ship faster.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        {siteConfig.description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/login">Get started free</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>
    </section>
  );
}
