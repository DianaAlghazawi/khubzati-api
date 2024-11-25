import { PrismaClient } from '@prisma/client';
import { roles } from './../src/enums/roles';

const prisma = new PrismaClient();
async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: role,
      create: role,
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
