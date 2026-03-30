import { IsOptional, IsDateString, IsIn, IsString, MaxLength } from 'class-validator';
import { APPOINTMENT_STATUS } from '../../constants/appointment-status.constants';
import type { AppointmentStatus } from '../../constants/appointment-status.constants';

export class UpdateAppointmentRequestDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsIn(Object.values(APPOINTMENT_STATUS))
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;
}
