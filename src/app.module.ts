import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { InspectionsModule } from './modules/inspections/inspections.module';

@Module({
  imports: [PrismaModule, AuthModule, ReportsModule, VehiclesModule, InspectionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
