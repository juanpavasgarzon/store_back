import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAppointmentRequestDto {
  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
