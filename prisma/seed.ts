import { PlanTier, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoOrg = await prisma.organization.upsert({
    where: { slug: "demo-agency" },
    update: {},
    create: {
      name: "Demo Agency",
      slug: "demo-agency",
      plan: PlanTier.AGENCY,
    },
  });

  console.log("Seeded organization:", demoOrg.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
