import { AppError } from '../errors/app-error';
import prisma from '../prismaClient';

enum Roles {
  Bakery = 'Bakery',
  Restaurant = 'Restaurant',
  Driver = 'Driver',
}

export const roles = [
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

export function isRoleValid(roleName: string): boolean {
  return Object.values(Roles).includes(roleName as Roles);
}

export async function getRoleByEnumName(roleName: string) {
  const role = await prisma.role.findFirst({
    where: {
      nameEn: roleName,
    },
    select: {
      id: true,
    },
  });
  if (!role) {
    throw new AppError('Role not found', 400);
  }
  return role;
}
