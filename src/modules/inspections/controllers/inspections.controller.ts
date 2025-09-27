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
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/types/role.type';
import { CreateInspectionDto, UpdateInspectionDto } from '../dto/inspection.dto';
import { InspectionFiltersDto, UpdateStatusDto } from '../dto/inspection-filters.dto';
import { 
  CreateInspectionUseCase, 
  GetInspectionsUseCase, 
  GetInspectionByIdUseCase, 
  UpdateInspectionUseCase,
  CompleteInspectionUseCase,
  UpdateInspectionStatusUseCase,
  DeleteInspectionUseCase
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
  async create(@Body() createInspectionDto: CreateInspectionDto): Promise<InspectionResponse> {
    return this.createInspectionUseCase.execute(createInspectionDto);
  }

  @Get()
  async findAll(@Query() filters: InspectionFiltersDto): Promise<InspectionResponse[]> {
    return this.getInspectionsUseCase.execute(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InspectionResponse> {
    return this.getInspectionByIdUseCase.execute(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInspectionDto: UpdateInspectionDto): Promise<InspectionResponse> {
    return this.updateInspectionUseCase.execute(id, updateInspectionDto);
  }

  @Put(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(@Param('id') id: string, @Body('observacoes') observacoes?: string): Promise<InspectionResponse> {
    return this.completeInspectionUseCase.execute(id, observacoes);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto): Promise<InspectionResponse> {
    return this.updateInspectionStatusUseCase.execute(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteInspectionUseCase.execute(id);
  }
}

