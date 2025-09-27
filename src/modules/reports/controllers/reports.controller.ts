import { Controller, Get, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/types/role.type';
import { OverviewReportDto } from '../dto/overview-report.dto';
import { OverviewReportUseCase } from '../use-cases/overview-report.use-case';
import { InspectorMetricsUseCase } from '../use-cases/inspector-metrics.use-case';
import { ExportReportsUseCase } from '../use-cases/export-reports.use-case';
import { OverviewReport, InspectorMetrics } from '../../../shared/interfaces/reports.interface';

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
  async getOverview(@Query() query: OverviewReportDto): Promise<OverviewReport> {
    return this.overviewReportUseCase.execute(query);
  }

  @Get('by-inspector')
  async getByInspector(): Promise<InspectorMetrics[]> {
    return this.inspectorMetricsUseCase.execute();
  }

  @Get('export/inspections')
  async exportInspections(@Query() query: OverviewReportDto, @Res() res: Response) {
    const csvPath = await this.exportReportsUseCase.exportInspectionsCSV(query);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inspections.csv');
    res.status(HttpStatus.OK).sendFile(csvPath, { root: '.' });
  }

  @Get('export/inspectors')
  async exportInspectors(@Res() res: Response) {
    const csvPath = await this.exportReportsUseCase.exportInspectorsCSV();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inspectors.csv');
    res.status(HttpStatus.OK).sendFile(csvPath, { root: '.' });
  }
}
