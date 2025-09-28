import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { InspectionResponse } from '../../../shared/interfaces/vehicle.interface';
import { StatusVistoria } from '../../../shared/types/status-vistoria.type';
import { ChecklistStatus } from '../../../shared/types/checklist-status.type';

@Injectable()
export class CreateInspectionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: {
    titulo: string;
    descricao: string;
    vehicleId: string;
    inspectorId: string;
    items: Array<{ key: string; status: ChecklistStatus; comment?: string }>;
  }): Promise<InspectionResponse> {
    const { titulo, descricao, vehicleId, inspectorId, items } = data;

    // Verificar se o veículo existe
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    // Verificar se o inspetor existe
    const inspector = await this.prisma.user.findUnique({
      where: { id: inspectorId },
    });

    if (!inspector) {
      throw new NotFoundException('Inspetor não encontrado');
    }

    // Criar vistoria com checklist
    const vistoria = await this.prisma.vistoria.create({
      data: {
        titulo,
        descricao,
        vehicleId,
        inspectorId,
        dataInicio: new Date(),
        checklistItems: {
          create: items.map((item) => ({
            key: item.key,
            status: item.status,
            comment: item.comment,
          })),
        },
      },
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    });

    return vistoria as InspectionResponse;
  }
}

@Injectable()
export class GetInspectionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filters?: {
    status?: StatusVistoria;
    inspectorId?: string;
    from?: string;
    to?: string;
    search?: string;
  }): Promise<InspectionResponse[]> {
    const { status, inspectorId, from, to, search } = filters || {};

    // Construir filtros dinâmicos
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (inspectorId) {
      where.inspectorId = inspectorId;
    }

    if (from || to) {
      where.dataInicio = {};
      if (from) {
        where.dataInicio.gte = new Date(from);
      }
      if (to) {
        where.dataInicio.lte = new Date(to);
      }
    }

    if (search) {
      where.OR = [
        {
          vehicle: {
            placa: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          vehicle: {
            modelo: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          vehicle: {
            marca: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const vistorias = await this.prisma.vistoria.findMany({
      where,
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return vistorias as InspectionResponse[];
  }
}

@Injectable()
export class GetInspectionByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<InspectionResponse> {
    const vistoria = await this.prisma.vistoria.findUnique({
      where: { id },
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    });

    if (!vistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    return vistoria as InspectionResponse;
  }
}

@Injectable()
export class UpdateInspectionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    data: {
      titulo?: string;
      descricao?: string;
      observacoes?: string;
      items?: Array<{ key: string; status: ChecklistStatus; comment?: string }>;
    },
  ): Promise<InspectionResponse> {
    const { titulo, descricao, observacoes, items } = data;

    // Verificar se a vistoria existe
    const existingVistoria = await this.prisma.vistoria.findUnique({
      where: { id },
    });

    if (!existingVistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    // Se está atualizando items, deletar os existentes e criar novos
    if (items) {
      await this.prisma.checklistItem.deleteMany({
        where: { vistoriaId: id },
      });
    }

    // Atualizar vistoria
    const vistoria = await this.prisma.vistoria.update({
      where: { id },
      data: {
        ...(titulo && { titulo }),
        ...(descricao && { descricao }),
        ...(observacoes && { observacoes }),
        ...(items && {
          checklistItems: {
            create: items.map((item) => ({
              key: item.key,
              status: item.status,
              comment: item.comment,
            })),
          },
        }),
      },
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    });

    return vistoria as InspectionResponse;
  }
}

@Injectable()
export class CompleteInspectionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, observacoes?: string): Promise<InspectionResponse> {
    // Verificar se a vistoria existe
    const existingVistoria = await this.prisma.vistoria.findUnique({
      where: { id },
      include: {
        checklistItems: true,
      },
    });

    if (!existingVistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    if (existingVistoria.status !== StatusVistoria.EM_ANDAMENTO) {
      throw new BadRequestException(
        'Apenas vistorias em andamento podem ser finalizadas',
      );
    }

    // Calcular status baseado no checklist
    const checklistItems = existingVistoria.checklistItems;
    const reprovados = checklistItems.filter(
      (item) => item.status === 'REPROVADO',
    ).length;
    const status =
      reprovados > 0 ? StatusVistoria.REPROVADA : StatusVistoria.APROVADA;

    // Calcular tempo gasto
    const dataInicio = existingVistoria.dataInicio;
    const dataFim = new Date();
    const tempoGasto = Math.round(
      (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60),
    ); // em minutos

    // Atualizar vistoria
    const vistoria = await this.prisma.vistoria.update({
      where: { id },
      data: {
        status,
        dataFim,
        tempoGasto,
        observacoes,
      },
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    });

    return vistoria as InspectionResponse;
  }
}

@Injectable()
export class UpdateInspectionStatusUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: string,
    data: { status: StatusVistoria },
  ): Promise<InspectionResponse> {
    const { status } = data;

    // Verificar se a vistoria existe
    const existingVistoria = await this.prisma.vistoria.findUnique({
      where: { id },
    });

    if (!existingVistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    // Validar transições de status
    const validTransitions: Record<StatusVistoria, StatusVistoria[]> = {
      [StatusVistoria.PENDENTE]: [
        StatusVistoria.EM_ANDAMENTO,
        StatusVistoria.CANCELADA,
      ],
      [StatusVistoria.EM_ANDAMENTO]: [
        StatusVistoria.APROVADA,
        StatusVistoria.REPROVADA,
        StatusVistoria.CANCELADA,
      ],
      [StatusVistoria.APROVADA]: [StatusVistoria.CANCELADA],
      [StatusVistoria.REPROVADA]: [StatusVistoria.CANCELADA],
      [StatusVistoria.CANCELADA]: [],
    };

    const currentStatus = existingVistoria.status as StatusVistoria;
    if (!validTransitions[currentStatus]?.includes(status)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} → ${status}`,
      );
    }

    // Se está finalizando a vistoria, calcular tempo gasto
    let updateData: any = { status };
    if (
      status === StatusVistoria.APROVADA ||
      status === StatusVistoria.REPROVADA
    ) {
      const dataFim = new Date();
      const tempoGasto = Math.round(
        (dataFim.getTime() - existingVistoria.dataInicio.getTime()) /
          (1000 * 60),
      );
      updateData.dataFim = dataFim;
      updateData.tempoGasto = tempoGasto;
    }

    // Atualizar vistoria
    const vistoria = await this.prisma.vistoria.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: true,
        inspector: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
    });

    return vistoria as InspectionResponse;
  }
}

@Injectable()
export class DeleteInspectionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string): Promise<void> {
    // Verificar se a vistoria existe
    const existingVistoria = await this.prisma.vistoria.findUnique({
      where: { id },
    });

    if (!existingVistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    // Verificar se pode ser excluída (apenas pendentes ou canceladas)
    if (
      existingVistoria.status !== StatusVistoria.PENDENTE &&
      existingVistoria.status !== StatusVistoria.CANCELADA
    ) {
      throw new BadRequestException(
        'Apenas vistorias pendentes ou canceladas podem ser excluídas',
      );
    }

    // Excluir checklist items primeiro
    await this.prisma.checklistItem.deleteMany({
      where: { vistoriaId: id },
    });

    // Excluir vistoria
    await this.prisma.vistoria.delete({
      where: { id },
    });
  }
}
