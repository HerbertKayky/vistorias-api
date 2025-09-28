import { Module } from '@nestjs/common';
import { VehiclesController } from './controllers/vehicles.controller';
import {
  CreateVehicleUseCase,
  GetVehiclesUseCase,
  GetVehicleByIdUseCase,
  GetVehicleWithVistoriasCountUseCase,
  UpdateVehicleUseCase,
  DeleteVehicleUseCase,
} from './use-cases/vehicle.use-cases';

@Module({
  controllers: [VehiclesController],
  providers: [
    CreateVehicleUseCase,
    GetVehiclesUseCase,
    GetVehicleByIdUseCase,
    GetVehicleWithVistoriasCountUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
})
export class VehiclesModule {}
