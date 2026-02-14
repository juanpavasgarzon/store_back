import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string | null;
}
