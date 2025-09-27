import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { OverviewReportDto } from '../dto/overview-report.dto';
import { createObjectCsvWriter } from 'csv-writer';

@Injectable()
export class ExportReportsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async exportInspectionsCSV(query: OverviewReportDto): Promise<string> {
    const { from, to } = query;
    
    // Definir período padrão se não fornecido
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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

    // Preparar dados para CSV
    const csvData = vistorias.map(vistoria => ({
      id: vistoria.id,
      titulo: vistoria.titulo,
      status: vistoria.status,
      dataInicio: vistoria.dataInicio.toISOString().split('T')[0],
      dataFim: vistoria.dataFim ? vistoria.dataFim.toISOString().split('T')[0] : '',
      tempoGasto: vistoria.tempoGasto || 0,
      observacoes: vistoria.observacoes || '',
      veiculoNome: vistoria.vehicle.nome,
      veiculoPlaca: vistoria.vehicle.placa,
      veiculoMarca: vistoria.vehicle.marca,
      veiculoModelo: vistoria.vehicle.modelo,
      veiculoAno: vistoria.vehicle.ano,
      veiculoProprietario: vistoria.vehicle.proprietario,
      inspectorNome: vistoria.inspector.name,
      inspectorEmail: vistoria.inspector.email,
      totalItens: vistoria.checklistItems.length,
      itensAprovados: vistoria.checklistItems.filter(item => item.status === 'APROVADO').length,
      itensReprovados: vistoria.checklistItems.filter(item => item.status === 'REPROVADO').length,
    }));

    // Criar CSV
    const csvWriter = createObjectCsvWriter({
      path: 'temp/inspections.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'titulo', title: 'Título' },
        { id: 'status', title: 'Status' },
        { id: 'dataInicio', title: 'Data Início' },
        { id: 'dataFim', title: 'Data Fim' },
        { id: 'tempoGasto', title: 'Tempo Gasto (min)' },
        { id: 'observacoes', title: 'Observações' },
        { id: 'veiculoNome', title: 'Veículo Nome' },
        { id: 'veiculoPlaca', title: 'Placa' },
        { id: 'veiculoMarca', title: 'Marca' },
        { id: 'veiculoModelo', title: 'Modelo' },
        { id: 'veiculoAno', title: 'Ano' },
        { id: 'veiculoProprietario', title: 'Proprietário' },
        { id: 'inspectorNome', title: 'Inspetor Nome' },
        { id: 'inspectorEmail', title: 'Inspetor Email' },
        { id: 'totalItens', title: 'Total Itens' },
        { id: 'itensAprovados', title: 'Itens Aprovados' },
        { id: 'itensReprovados', title: 'Itens Reprovados' },
      ],
    });

    await csvWriter.writeRecords(csvData);
    
    return 'temp/inspections.csv';
  }

  async exportInspectorsCSV(): Promise<string> {
    // Buscar todos os inspetores com suas vistorias
    const inspectors = await this.prisma.user.findMany({
      where: {
        role: 'INSPECTOR',
      },
      include: {
        vistorias: {
          where: {
            status: {
              in: ['APROVADA', 'REPROVADA', 'PENDENTE', 'EM_ANDAMENTO', 'CANCELADA'],
            },
          },
        },
      },
    });

    // Preparar dados para CSV
    const csvData = inspectors.map(inspector => {
      const vistorias = inspector.vistorias;
      const total = vistorias.length;
      const aprovadas = vistorias.filter(v => v.status === 'APROVADA').length;
      const reprovadas = vistorias.filter(v => v.status === 'REPROVADA').length;
      
      // Calcular tempo médio
      const vistoriasComTempo = vistorias.filter(v => v.tempoGasto && v.tempoGasto > 0);
      const tempoMedio = vistoriasComTempo.length > 0 
        ? vistoriasComTempo.reduce((sum, v) => sum + (v.tempoGasto || 0), 0) / vistoriasComTempo.length
        : 0;

      return {
        id: inspector.id,
        nome: inspector.name,
        email: inspector.email,
        totalVistorias: total,
        aprovadas: aprovadas,
        reprovadas: reprovadas,
        pendentes: vistorias.filter(v => v.status === 'PENDENTE').length,
        emAndamento: vistorias.filter(v => v.status === 'EM_ANDAMENTO').length,
        canceladas: vistorias.filter(v => v.status === 'CANCELADA').length,
        tempoMedio: Math.round(tempoMedio),
        taxaAprovacao: total > 0 ? Math.round((aprovadas / total) * 100) : 0,
      };
    });

    // Criar CSV
    const csvWriter = createObjectCsvWriter({
      path: 'temp/inspectors.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'nome', title: 'Nome' },
        { id: 'email', title: 'Email' },
        { id: 'totalVistorias', title: 'Total Vistorias' },
        { id: 'aprovadas', title: 'Aprovadas' },
        { id: 'reprovadas', title: 'Reprovadas' },
        { id: 'pendentes', title: 'Pendentes' },
        { id: 'emAndamento', title: 'Em Andamento' },
        { id: 'canceladas', title: 'Canceladas' },
        { id: 'tempoMedio', title: 'Tempo Médio (min)' },
        { id: 'taxaAprovacao', title: 'Taxa Aprovação (%)' },
      ],
    });

    await csvWriter.writeRecords(csvData);
    
    return 'temp/inspectors.csv';
  }
}
