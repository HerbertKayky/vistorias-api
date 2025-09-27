import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusVistoria } from '../../../shared/types/status-vistoria.type';

export class InspectionFiltersDto {
  @IsOptional()
  @IsEnum(StatusVistoria)
  status?: StatusVistoria;

  @IsOptional()
  @IsString()
  inspectorId?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : undefined)
  from?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : undefined)
  to?: string;

  @IsOptional()
  @IsString()
  search?: string; // busca por placa/modelo
}

export class UpdateStatusDto {
  @IsEnum(StatusVistoria)
  status: StatusVistoria;
}
