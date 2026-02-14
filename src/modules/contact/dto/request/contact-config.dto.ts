import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateContactConfigRequestDto {
  @IsEmail()
  recipientEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subjectTemplate?: string | null;

  @IsOptional()
  @IsString()
  messageTemplate?: string | null;
}
