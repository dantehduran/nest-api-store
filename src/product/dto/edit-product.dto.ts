import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsOptional()
  price?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;
}
