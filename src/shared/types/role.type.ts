// Enum compartilhado para evitar problemas de import do Prisma
export enum Role {
  ADMIN = 'ADMIN',
  INSPECTOR = 'INSPECTOR',
  USER = 'USER'
}

export type RoleType = keyof typeof Role;
