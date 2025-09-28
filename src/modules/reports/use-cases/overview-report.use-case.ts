import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { OverviewReport } from '../../../shared/interfaces/reports.interface';
import { StatusVistoria } from '../../../shared/types/status-vistoria.type';

@Injectable()
export class OverviewReportUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: {
    from?: string;
    to?: string;
  }): Promise<OverviewReport> {
    const { from, to } = query;

    // Definir período padrão se não fornecido
    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
    const toDate = to ? new Date(to) : new Date();

    // Buscar vistorias no período
    const vistorias = await this.prisma.vistoria.findMany({
      where: {
        dataInicio: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        inspector: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Calcular métricas
    const total = vistorias.length;
    const aprovadas = vistorias.filter(
      (v) => v.status === StatusVistoria.APROVADA,
    ).length;
    const reprovadas = vistorias.filter(
      (v) => v.status === StatusVistoria.REPROVADA,
    ).length;

    // Calcular tempo médio (apenas vistorias finalizadas com tempo gasto)
    const vistoriasComTempo = vistorias.filter(
      (v) => v.tempoGasto && v.tempoGasto > 0,
    );
    const tempoMedio =
      vistoriasComTempo.length > 0
        ? vistoriasComTempo.reduce((sum, v) => sum + (v.tempoGasto || 0), 0) /
          vistoriasComTempo.length
        : 0;

    return {
      total,
      aprovadas,
      reprovadas,
      tempoMedio: Math.round(tempoMedio),
      periodo: {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
      },
    };
  }
}
