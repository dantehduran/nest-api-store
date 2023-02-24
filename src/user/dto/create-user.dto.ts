import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
