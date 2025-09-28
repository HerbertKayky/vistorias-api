import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/types/role.type';
import {
  CreateVehicleUseCase,
  GetVehiclesUseCase,
  GetVehicleByIdUseCase,
  GetVehicleWithVistoriasCountUseCase,
  UpdateVehicleUseCase,
  DeleteVehicleUseCase,
} from '../use-cases/vehicle.use-cases';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.INSPECTOR)
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly getVehiclesUseCase: GetVehiclesUseCase,
    private readonly getVehicleByIdUseCase: GetVehicleByIdUseCase,
    private readonly getVehicleWithVistoriasCountUseCase: GetVehicleWithVistoriasCountUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      nome: string;
      placa: string;
      marca: string;
      modelo: string;
      ano: number;
      proprietario: string;
    },
  ) {
    return this.createVehicleUseCase.execute(body);
  }

  @Get()
  async findAll() {
    return this.getVehiclesUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getVehicleByIdUseCase.execute(id);
  }

  @Get(':id/count')
  async findOneWithCount(@Param('id') id: string) {
    return this.getVehicleWithVistoriasCountUseCase.execute(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      nome?: string;
      placa?: string;
      marca?: string;
      modelo?: string;
      ano?: number;
      proprietario?: string;
    },
  ) {
    return this.updateVehicleUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteVehicleUseCase.execute(id);
  }
}
