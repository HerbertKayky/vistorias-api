import { PrismaService } from '../shared/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

export class UsersSeed {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    console.log('🌱 Criando usuários...');

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário admin
    const admin = await this.prisma.user.upsert({
      where: { email: 'admin@vistorias.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@vistorias.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Criar inspetores
    const inspector1 = await this.prisma.user.upsert({
      where: { email: 'inspector1@vistorias.com' },
      update: {},
      create: {
        name: 'João Silva',
        email: 'inspector1@vistorias.com',
        password: hashedPassword,
        role: 'INSPECTOR',
      },
    });

    const inspector2 = await this.prisma.user.upsert({
      where: { email: 'inspector2@vistorias.com' },
      update: {},
      create: {
        name: 'Maria Santos',
        email: 'inspector2@vistorias.com',
        password: hashedPassword,
        role: 'INSPECTOR',
      },
    });

    console.log(`✅ Usuários criados:`);
    console.log(`   - Admin: ${admin.name} (${admin.email})`);
    console.log(`   - Inspetor 1: ${inspector1.name} (${inspector1.email})`);
    console.log(`   - Inspetor 2: ${inspector2.name} (${inspector2.email})`);
    console.log(`   - Senha padrão para todos: 123456`);
  }
}
