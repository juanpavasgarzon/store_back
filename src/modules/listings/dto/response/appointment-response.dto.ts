import type { Appointment } from '../../entities/appointment.entity';

export class AppointmentResponseDto {
  id: string;
  userId: string;
  listingId: string;
  scheduledAt: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(appointment: Appointment) {
    this.id = appointment.id;
    this.userId = appointment.userId;
    this.listingId = appointment.listingId;
    this.scheduledAt = appointment.scheduledAt;
    this.status = appointment.status;
    this.notes = appointment.notes ?? null;
    this.createdAt = appointment.createdAt;
    this.updatedAt = appointment.updatedAt;
  }
}
