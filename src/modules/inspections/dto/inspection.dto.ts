import { IsString, IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ChecklistStatus } from '../../../shared/types/checklist-status.type';

export class ChecklistItemDto {
  @IsString()
  key: string;

  @IsEnum(ChecklistStatus)
  status: ChecklistStatus;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateInspectionDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  vehicleId: string;

  @IsString()
  inspectorId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}

export class UpdateInspectionDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items?: ChecklistItemDto[];
}

