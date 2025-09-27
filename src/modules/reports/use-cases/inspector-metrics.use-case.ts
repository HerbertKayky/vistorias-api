import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { InspectorMetrics } from '../../../shared/interfaces/reports.interface';
import { StatusVistoria } from '../../../shared/types/status-vistoria.type';

@Injectable()
export class InspectorMetricsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<InspectorMetrics[]> {
    // Buscar todos os inspetores com suas vistorias
    const inspectors = await this.prisma.user.findMany({
      where: {
        role: 'INSPECTOR',
      },
      include: {
        vistorias: {
          where: {
            status: {
              in: [StatusVistoria.APROVADA, StatusVistoria.REPROVADA, StatusVistoria.PENDENTE, StatusVistoria.EM_ANDAMENTO, StatusVistoria.CANCELADA],
            },
          },
        },
      },
    });

    // Calcular métricas para cada inspetor
    const metrics: InspectorMetrics[] = inspectors.map(inspector => {
      const vistorias = inspector.vistorias;
      const total = vistorias.length;
      const aprovadas = vistorias.filter(v => v.status === StatusVistoria.APROVADA).length;
      const reprovadas = vistorias.filter(v => v.status === StatusVistoria.REPROVADA).length;
      
      // Calcular tempo médio
      const vistoriasComTempo = vistorias.filter(v => v.tempoGasto && v.tempoGasto > 0);
      const tempoMedio = vistoriasComTempo.length > 0 
        ? vistoriasComTempo.reduce((sum, v) => sum + (v.tempoGasto || 0), 0) / vistoriasComTempo.length
        : 0;

      // Contar por status
      const statusCount = {
        [StatusVistoria.PENDENTE]: vistorias.filter(v => v.status === StatusVistoria.PENDENTE).length,
        [StatusVistoria.EM_ANDAMENTO]: vistorias.filter(v => v.status === StatusVistoria.EM_ANDAMENTO).length,
        [StatusVistoria.APROVADA]: aprovadas,
        [StatusVistoria.REPROVADA]: reprovadas,
        [StatusVistoria.CANCELADA]: vistorias.filter(v => v.status === StatusVistoria.CANCELADA).length,
      };

      return {
        inspectorId: inspector.id,
        inspectorName: inspector.name,
        inspectorEmail: inspector.email,
        total,
        aprovadas,
        reprovadas,
        tempoMedio: Math.round(tempoMedio),
        status: statusCount,
      };
    });

    // Ordenar por total de vistorias (decrescente)
    return metrics.sort((a, b) => b.total - a.total);
  }
}
