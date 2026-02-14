import { IsOptional, IsDateString, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentRequestDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
