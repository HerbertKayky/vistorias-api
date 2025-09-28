import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  BrandsReportResponse,
  ProblemsReportResponse,
} from '../../../shared/interfaces/reports.interface';

@Injectable()
export class ExportReportsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async getInspectionsData(query: { from?: string; to?: string }) {
    const { from, to } = query;

    // Definir período padrão se não fornecido
    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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
        vehicle: true,
        inspector: {
          select: {
            name: true,
            email: true,
          },
        },
        checklistItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Preparar dados para retorno
    const data = vistorias.map((vistoria) => ({
      id: vistoria.id,
      titulo: vistoria.titulo,
      status: vistoria.status,
      dataInicio: vistoria.dataInicio.toISOString().split('T')[0],
      dataFim: vistoria.dataFim
        ? vistoria.dataFim.toISOString().split('T')[0]
        : null,
      tempoGasto: vistoria.tempoGasto || 0,
      observacoes: vistoria.observacoes || '',
      veiculo: {
        nome: vistoria.vehicle.nome,
        placa: vistoria.vehicle.placa,
        marca: vistoria.vehicle.marca,
        modelo: vistoria.vehicle.modelo,
        ano: vistoria.vehicle.ano,
        proprietario: vistoria.vehicle.proprietario,
      },
      inspector: {
        nome: vistoria.inspector.name,
        email: vistoria.inspector.email,
      },
      checklist: {
        totalItens: vistoria.checklistItems.length,
        itensAprovados: vistoria.checklistItems.filter(
          (item) => item.status === 'APROVADO',
        ).length,
        itensReprovados: vistoria.checklistItems.filter(
          (item) => item.status === 'REPROVADO',
        ).length,
        itensNaoAplicaveis: vistoria.checklistItems.filter(
          (item) => item.status === 'NAO_APLICAVEL',
        ).length,
      },
    }));

    return {
      periodo: {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0],
      },
      total: data.length,
      vistorias: data,
    };
  }

  async getInspectorsData() {
    // Buscar todos os inspetores com suas vistorias
    const inspectors = await this.prisma.user.findMany({
      where: {
        role: 'INSPECTOR',
      },
      include: {
        vistorias: {
          where: {
            status: {
              in: [
                'APROVADA',
                'REPROVADA',
                'PENDENTE',
                'EM_ANDAMENTO',
                'CANCELADA',
              ],
            },
          },
        },
      },
    });

    // Preparar dados para retorno
    const data = inspectors.map((inspector) => {
      const vistorias = inspector.vistorias;
      const total = vistorias.length;
      const aprovadas = vistorias.filter((v) => v.status === 'APROVADA').length;
      const reprovadas = vistorias.filter(
        (v) => v.status === 'REPROVADA',
      ).length;

      // Calcular tempo médio
      const vistoriasComTempo = vistorias.filter(
        (v) => v.tempoGasto && v.tempoGasto > 0,
      );
      const tempoMedio =
        vistoriasComTempo.length > 0
          ? vistoriasComTempo.reduce((sum, v) => sum + (v.tempoGasto || 0), 0) /
            vistoriasComTempo.length
          : 0;

      return {
        id: inspector.id,
        nome: inspector.name,
        email: inspector.email,
        totalVistorias: total,
        aprovadas: aprovadas,
        reprovadas: reprovadas,
        pendentes: vistorias.filter((v) => v.status === 'PENDENTE').length,
        emAndamento: vistorias.filter((v) => v.status === 'EM_ANDAMENTO')
          .length,
        canceladas: vistorias.filter((v) => v.status === 'CANCELADA').length,
        tempoMedio: Math.round(tempoMedio),
        taxaAprovacao: total > 0 ? Math.round((aprovadas / total) * 100) : 0,
      };
    });

    return {
      total: data.length,
      inspetores: data.sort((a, b) => b.totalVistorias - a.totalVistorias),
    };
  }

  async getBrandsReport(): Promise<BrandsReportResponse> {
    // Buscar todas as vistorias com dados do veículo
    const vistorias = await this.prisma.vistoria.findMany({
      where: {
        status: {
          in: ['APROVADA', 'REPROVADA'],
        },
      },
      include: {
        vehicle: true,
      },
    });

    // Agrupar por marca
    const marcaStats = new Map<
      string,
      {
        total: number;
        aprovadas: number;
        reprovadas: number;
        tempoTotal: number;
        tempoCount: number;
      }
    >();

    vistorias.forEach((vistoria) => {
      const marca = vistoria.vehicle.marca;
      const stats = marcaStats.get(marca) || {
        total: 0,
        aprovadas: 0,
        reprovadas: 0,
        tempoTotal: 0,
        tempoCount: 0,
      };

      stats.total++;
      if (vistoria.status === 'APROVADA') {
        stats.aprovadas++;
      } else if (vistoria.status === 'REPROVADA') {
        stats.reprovadas++;
      }

      if (vistoria.tempoGasto && vistoria.tempoGasto > 0) {
        stats.tempoTotal += vistoria.tempoGasto;
        stats.tempoCount++;
      }

      marcaStats.set(marca, stats);
    });

    // Converter para array e calcular métricas
    const marcas = Array.from(marcaStats.entries()).map(([marca, stats]) => ({
      marca,
      totalVistorias: stats.total,
      aprovadas: stats.aprovadas,
      reprovadas: stats.reprovadas,
      taxaAprovacao:
        stats.total > 0 ? Math.round((stats.aprovadas / stats.total) * 100) : 0,
      tempoMedio:
        stats.tempoCount > 0
          ? Math.round(stats.tempoTotal / stats.tempoCount)
          : 0,
    }));

    // Ordenar por total de vistorias (decrescente)
    marcas.sort((a, b) => b.totalVistorias - a.totalVistorias);

    return {
      total: marcas.length,
      marcas,
    };
  }

  async getProblemsReport(): Promise<ProblemsReportResponse> {
    // Buscar todos os itens de checklist reprovados
    const checklistItems = await this.prisma.checklistItem.findMany({
      where: {
        status: 'REPROVADO',
      },
      include: {
        vistoria: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    // Agrupar por item (key)
    const problemaStats = new Map<
      string,
      {
        totalReprovacoes: number;
        marcas: Set<string>;
        exemplos: Array<{
          vistoriaId: string;
          veiculo: string;
          placa: string;
          comentario?: string;
        }>;
      }
    >();

    checklistItems.forEach((item) => {
      const key = item.key;
      const stats = problemaStats.get(key) || {
        totalReprovacoes: 0,
        marcas: new Set<string>(),
        exemplos: [],
      };

      stats.totalReprovacoes++;
      stats.marcas.add(item.vistoria.vehicle.marca);

      // Adicionar exemplo (máximo 5 por problema)
      if (stats.exemplos.length < 5) {
        stats.exemplos.push({
          vistoriaId: item.vistoria.id,
          veiculo: item.vistoria.vehicle.nome,
          placa: item.vistoria.vehicle.placa,
          comentario: item.comment || undefined,
        });
      }

      problemaStats.set(key, stats);
    });

    // Calcular total de vistorias para percentual
    const totalVistorias = await this.prisma.vistoria.count({
      where: {
        status: {
          in: ['APROVADA', 'REPROVADA'],
        },
      },
    });

    // Converter para array e calcular percentuais
    const problemas = Array.from(problemaStats.entries()).map(
      ([item, stats]) => ({
        item,
        totalReprovacoes: stats.totalReprovacoes,
        percentualReprovacao:
          totalVistorias > 0
            ? Math.round(
                (stats.totalReprovacoes / totalVistorias) * 100 * 100,
              ) / 100 // Arredondar para 2 casas decimais
            : 0,
        marcasAfetadas: Array.from(stats.marcas).sort(),
        exemplos: stats.exemplos,
      }),
    );

    // Ordenar por total de reprovações (decrescente)
    problemas.sort((a, b) => b.totalReprovacoes - a.totalReprovacoes);

    return {
      total: problemas.length,
      problemas,
    };
  }
}
