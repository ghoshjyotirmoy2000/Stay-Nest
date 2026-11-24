import { prisma } from "../db";
import { hashPassword } from "../utils/hashPassword";

const main = async () => {
  const email = process.env.SUPERADMIN_EMAIL || "admin@staynest.com";
  const password = process.env.SUPERADMIN_PASSWORD || "Admin@123";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Superadmin already exists: ${email}`);
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      firstname: "Super",
      lastname: "Admin",
      password: hashedPassword,
      role: "SUPERADMIN",
      phone: "9999999999",
    },
  });

  console.log(`Superadmin created: ${email} / ${password}`);
};

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
