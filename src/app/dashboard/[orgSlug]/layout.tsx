import { Sidebar } from "@/components/layout/sidebar";
import { requireOrganization } from "@/lib/session";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { organization, plan } = await requireOrganization(orgSlug);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgSlug={organization.slug} plan={plan} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
