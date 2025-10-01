import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("admin123", 10);
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });
  if (!adminExists) {
    await prisma.user.create({
      data: {
        fullName: "Admin User",
        birthDate: new Date("1990-01-01"),
        email: "admin@example.com",
        password: pass,
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log("Admin created: admin@example.com / admin123");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
