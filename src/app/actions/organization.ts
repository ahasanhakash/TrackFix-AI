"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { createOrganizationSchema } from "@/lib/validations/organization";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createOrganizationAction(formData: FormData) {
  const user = await requireUser();

  const parsed = createOrganizationSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    throw new Error("Invalid organization details");
  }

  const existing = await db.organization.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existing) {
    throw new Error("This workspace slug is already taken");
  }

  const org = await db.organization.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      members: {
        create: {
          userId: user.id,
          role: MemberRole.OWNER,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/${org.slug}`);
}
