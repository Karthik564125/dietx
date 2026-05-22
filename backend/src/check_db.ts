import prisma from './prismaClient';

async function main() {
  console.log("Fetching all users...");
  const users = await (prisma as any).user.findMany();
  console.log("Users:", users.map((u: any) => ({ id: u.id, email: u.email, phone: u.phone, profileComplete: u.profileComplete })));

  console.log("\nFetching all purchases...");
  const purchases = await (prisma as any).nutritionPlanPurchase.findMany();
  console.log("Purchases:", purchases);
}

main()
  .catch(e => console.error("Error running script:", e))
  .finally(() => (prisma as any).$disconnect());
