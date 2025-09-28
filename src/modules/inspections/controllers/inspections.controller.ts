import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/types/role.type';
import { ChecklistStatus } from '../../../shared/types/checklist-status.type';
import { StatusVistoria } from '../../../shared/types/status-vistoria.type';
import {
  CreateInspectionUseCase,
  GetInspectionsUseCase,
  GetInspectionByIdUseCase,
  UpdateInspectionUseCase,
  CompleteInspectionUseCase,
  UpdateInspectionStatusUseCase,
  DeleteInspectionUseCase,
} from '../use-cases/inspection.use-cases';
import { InspectionResponse } from '../../../shared/interfaces/vehicle.interface';

@Controller('inspections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.INSPECTOR)
export class InspectionsController {
  constructor(
    private readonly createInspectionUseCase: CreateInspectionUseCase,
    private readonly getInspectionsUseCase: GetInspectionsUseCase,
    private readonly getInspectionByIdUseCase: GetInspectionByIdUseCase,
    private readonly updateInspectionUseCase: UpdateInspectionUseCase,
    private readonly completeInspectionUseCase: CompleteInspectionUseCase,
    private readonly updateInspectionStatusUseCase: UpdateInspectionStatusUseCase,
    private readonly deleteInspectionUseCase: DeleteInspectionUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      titulo: string;
      descricao: string;
      vehicleId: string;
      inspectorId: string;
      items: Array<{ key: string; status: ChecklistStatus; comment?: string }>;
    },
  ): Promise<InspectionResponse> {
    return this.createInspectionUseCase.execute(body);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      status?: StatusVistoria;
      inspectorId?: string;
      from?: string;
      to?: string;
      search?: string;
    },
  ): Promise<InspectionResponse[]> {
    return this.getInspectionsUseCase.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InspectionResponse> {
    return this.getInspectionByIdUseCase.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      titulo?: string;
      descricao?: string;
      observacoes?: string;
      items?: Array<{ key: string; status: ChecklistStatus; comment?: string }>;
    },
  ): Promise<InspectionResponse> {
    return this.updateInspectionUseCase.execute(id, body);
  }

  @Put(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(
    @Param('id') id: string,
    @Body('observacoes') observacoes?: string,
  ): Promise<InspectionResponse> {
    return this.completeInspectionUseCase.execute(id, observacoes);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: StatusVistoria },
  ): Promise<InspectionResponse> {
    return this.updateInspectionStatusUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteInspectionUseCase.execute(id);
  }
}
