import { redirect } from "next/navigation";
import { getActiveOrganization, requireUser } from "@/lib/session";

export default async function DashboardRedirectPage() {
  const user = await requireUser();
  const org = await getActiveOrganization(user);

  if (!org) {
    redirect("/onboarding");
  }

  redirect(`/dashboard/${org.slug}`);
}
