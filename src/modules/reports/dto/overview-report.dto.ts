import { IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class OverviewReportDto {
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : undefined)
  from?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : undefined)
  to?: string;
}
