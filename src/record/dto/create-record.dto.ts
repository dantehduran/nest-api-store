import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(['INCREMENT', 'DECREMENT'])
  type: 'INCREMENT' | 'DECREMENT';

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
