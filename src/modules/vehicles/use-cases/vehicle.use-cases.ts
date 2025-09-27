import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto';

// Tipo local para evitar problemas de import
type Vehicle = {
  id: string;
  nome: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  proprietario: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const { nome, placa, marca, modelo, ano, proprietario } = createVehicleDto;

    // Verificar se a placa já existe
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { placa },
    });

    if (existingVehicle) {
      throw new ConflictException('Veículo com esta placa já existe');
    }

    // Criar veículo
    const vehicle = await this.prisma.vehicle.create({
      data: {
        nome,
        placa,
        marca,
        modelo,
        ano,
        proprietario,
      },
    });

    return vehicle as Vehicle;
  }
}

@Injectable()
export class GetVehiclesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return vehicles as Vehicle[];
  }
}

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle as Vehicle;
  }
}

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const { placa, ...updateData } = updateVehicleDto;

    // Verificar se o veículo existe
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    // Se está atualizando a placa, verificar se já existe
    if (placa && placa !== existingVehicle.placa) {
      const vehicleWithSamePlaca = await this.prisma.vehicle.findUnique({
        where: { placa },
      });

      if (vehicleWithSamePlaca) {
        throw new ConflictException('Veículo com esta placa já existe');
      }
    }

    // Atualizar veículo
    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        ...updateData,
        ...(placa && { placa }),
      },
    });

    return vehicle as Vehicle;
  }
}

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<void> {
    // Verificar se o veículo existe
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!existingVehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    // Verificar se há vistorias associadas
    const vistorias = await this.prisma.vistoria.findMany({
      where: { vehicleId: id },
    });

    if (vistorias.length > 0) {
      throw new ConflictException('Não é possível excluir veículo com vistorias associadas');
    }

    // Excluir veículo
    await this.prisma.vehicle.delete({
      where: { id },
    });
  }
}

