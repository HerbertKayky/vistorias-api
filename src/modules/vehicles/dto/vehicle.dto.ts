import { IsString, IsInt, MinLength, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsString()
  @MinLength(7)
  placa: string;

  @IsString()
  @MinLength(2)
  marca: string;

  @IsString()
  @MinLength(2)
  modelo: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number;

  @IsString()
  @MinLength(2)
  proprietario: string;
}

export class UpdateVehicleDto {
  @IsString()
  @MinLength(2)
  nome?: string;

  @IsString()
  @MinLength(7)
  placa?: string;

  @IsString()
  @MinLength(2)
  marca?: string;

  @IsString()
  @MinLength(2)
  modelo?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano?: number;

  @IsString()
  @MinLength(2)
  proprietario?: string;
}

