import { IsOptional, IsString } from 'class-validator';

export class EditDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  username?: string;
}
