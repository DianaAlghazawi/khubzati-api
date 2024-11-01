import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const roles = [
    {
      id: 'bd81ac9b-4bba-4483-a88c-3b01b54f6c55',
      nameEn: 'Admin',
      nameAr: 'مدير',
    },
    {
      id: '5fa44afd-e944-4a5a-abe1-bb782892c30f',
      nameEn: 'Bakery',
      nameAr: 'مخبز',
    },
    {
      id: 'd3304475-e1f6-40ae-9453-8f2950b14366',
      nameEn: 'Restaurant',
      nameAr: 'مطعم',
    },
    {
      id: 'ac8de7d7-0b1e-4618-b095-c0793e724703',
      nameEn: 'Driver',
      nameAr: 'سائق',
    },
  ];
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
