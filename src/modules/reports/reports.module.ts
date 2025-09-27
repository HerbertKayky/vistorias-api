import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { OverviewReportUseCase } from './use-cases/overview-report.use-case';
import { InspectorMetricsUseCase } from './use-cases/inspector-metrics.use-case';
import { ExportReportsUseCase } from './use-cases/export-reports.use-case';

@Module({
  controllers: [ReportsController],
  providers: [
    OverviewReportUseCase,
    InspectorMetricsUseCase,
    ExportReportsUseCase,
  ],
})
export class ReportsModule {}
