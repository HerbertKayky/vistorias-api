import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PrismaService } from '../shared/prisma/prisma.service';
import { UsersSeed } from './users.seed';
import { VehiclesSeed } from './vehicles.seed';
import { InspectionsSeed } from './inspections.seed';

async function main() {
  console.log('🌱 Iniciando processo de seed...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);

  try {
    // Limpar dados existentes (opcional - descomente se quiser resetar)
    // console.log('🧹 Limpando dados existentes...');
    // await prismaService.checklistItem.deleteMany();
    // await prismaService.vistoria.deleteMany();
    // await prismaService.vehicle.deleteMany();
    // await prismaService.user.deleteMany();
    // console.log('✅ Dados limpos!\n');

    // Executar seeds na ordem correta
    const usersSeed = new UsersSeed(prismaService);
    await usersSeed.execute();
    console.log('');

    const vehiclesSeed = new VehiclesSeed(prismaService);
    await vehiclesSeed.execute();
    console.log('');

    const inspectionsSeed = new InspectionsSeed(prismaService);
    await inspectionsSeed.execute();
    console.log('');

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo dos dados criados:');
    console.log('   - 1 usuário admin');
    console.log('   - 2 usuários inspetores');
    console.log('   - 10 veículos');
    console.log('   - 20 vistorias distribuídas entre os status');
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@vistorias.com / 123456');
    console.log('   Inspetor 1: inspector1@vistorias.com / 123456');
    console.log('   Inspetor 2: inspector2@vistorias.com / 123456');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
