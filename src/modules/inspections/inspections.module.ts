import { Module } from '@nestjs/common';
import { InspectionsController } from './controllers/inspections.controller';
import { 
  CreateInspectionUseCase, 
  GetInspectionsUseCase, 
  GetInspectionByIdUseCase, 
  UpdateInspectionUseCase,
  CompleteInspectionUseCase,
  UpdateInspectionStatusUseCase,
  DeleteInspectionUseCase
} from './use-cases/inspection.use-cases';

@Module({
  controllers: [InspectionsController],
  providers: [
    CreateInspectionUseCase,
    GetInspectionsUseCase,
    GetInspectionByIdUseCase,
    UpdateInspectionUseCase,
    CompleteInspectionUseCase,
    UpdateInspectionStatusUseCase,
    DeleteInspectionUseCase,
  ],
})
export class InspectionsModule {}

