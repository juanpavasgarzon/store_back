import type { Appointment } from '../../entities/appointment.entity';
import { ListingResponseDto } from './listing-response.dto';

export class AppointmentResponseDto {
  id: string;
  userId: string;
  listingId: string;
  scheduledAt: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  listing?: ListingResponseDto;

  constructor(appointment: Appointment) {
    this.id = appointment.id;
    this.userId = appointment.userId;
    this.listingId = appointment.listingId;
    this.scheduledAt = appointment.scheduledAt;
    this.status = appointment.status;
    this.notes = appointment.notes ?? null;
    this.createdAt = appointment.createdAt;
    this.updatedAt = appointment.updatedAt;
    if (appointment.listing) {
      this.listing = new ListingResponseDto(appointment.listing);
    }
  }
}
