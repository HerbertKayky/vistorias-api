import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/types/role.type';
import { OverviewReportUseCase } from '../use-cases/overview-report.use-case';
import { InspectorMetricsUseCase } from '../use-cases/inspector-metrics.use-case';
import { ExportReportsUseCase } from '../use-cases/export-reports.use-case';
import {
  OverviewReport,
  InspectorMetrics,
  InspectionsReportResponse,
  InspectorsReportResponse,
  BrandsReportResponse,
  ProblemsReportResponse,
} from '../../../shared/interfaces/reports.interface';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.INSPECTOR)
export class ReportsController {
  constructor(
    private readonly overviewReportUseCase: OverviewReportUseCase,
    private readonly inspectorMetricsUseCase: InspectorMetricsUseCase,
    private readonly exportReportsUseCase: ExportReportsUseCase,
  ) {}

  @Get('overview')
  async getOverview(
    @Query() query: { from?: string; to?: string },
  ): Promise<OverviewReport> {
    return this.overviewReportUseCase.execute(query);
  }

  @Get('by-inspector')
  async getByInspector(): Promise<InspectorMetrics[]> {
    return this.inspectorMetricsUseCase.execute();
  }

  @Get('export/inspections')
  async exportInspections(
    @Query() query: { from?: string; to?: string },
  ): Promise<{
    success: boolean;
    data?: InspectionsReportResponse;
    message: string;
    error?: string;
  }> {
    try {
      const data = await this.exportReportsUseCase.getInspectionsData(query);
      return {
        success: true,
        data,
        message: 'Dados das vistorias obtidos com sucesso',
      };
    } catch (error) {
      console.error('Erro ao obter dados das vistorias:', error);
      return {
        success: false,
        message: 'Erro interno ao obter dados das vistorias',
        error: error.message,
      };
    }
  }

  @Get('export/inspectors')
  async exportInspectors(): Promise<{
    success: boolean;
    data?: InspectorsReportResponse;
    message: string;
    error?: string;
  }> {
    try {
      const data = await this.exportReportsUseCase.getInspectorsData();
      return {
        success: true,
        data,
        message: 'Dados dos inspetores obtidos com sucesso',
      };
    } catch (error) {
      console.error('Erro ao obter dados dos inspetores:', error);
      return {
        success: false,
        message: 'Erro interno ao obter dados dos inspetores',
        error: error.message,
      };
    }
  }

  @Get('export/brands')
  async exportBrands(): Promise<{
    success: boolean;
    data?: BrandsReportResponse;
    message: string;
    error?: string;
  }> {
    try {
      const data = await this.exportReportsUseCase.getBrandsReport();
      return {
        success: true,
        data,
        message: 'Relatório de marcas obtido com sucesso',
      };
    } catch (error) {
      console.error('Erro ao obter relatório de marcas:', error);
      return {
        success: false,
        message: 'Erro interno ao obter relatório de marcas',
        error: error.message,
      };
    }
  }

  @Get('export/problems')
  async exportProblems(): Promise<{
    success: boolean;
    data?: ProblemsReportResponse;
    message: string;
    error?: string;
  }> {
    try {
      const data = await this.exportReportsUseCase.getProblemsReport();
      return {
        success: true,
        data,
        message: 'Relatório de problemas obtido com sucesso',
      };
    } catch (error) {
      console.error('Erro ao obter relatório de problemas:', error);
      return {
        success: false,
        message: 'Erro interno ao obter relatório de problemas',
        error: error.message,
      };
    }
  }
}
