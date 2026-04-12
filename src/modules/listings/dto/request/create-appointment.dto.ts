import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsFutureDate } from '../../../../shared';

export class CreateAppointmentRequestDto {
  @IsDateString()
  @IsFutureDate()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
