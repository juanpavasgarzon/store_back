import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Appointment } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import { MailerService } from '../../mailer/mailer.service';
import { LISTING_DOMAIN_EVENTS, type AppointmentStatusChangedEvent } from '../events';
import type { IUser } from '../../../shared';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { UpdateAppointmentRequestDto } from '../dto/request/update-appointment.dto';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly mailerService: MailerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, user: IUser, dto: UpdateAppointmentRequestDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['listing', 'user'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    await this.assertCanUpdate(appointment, user);

    const previousStatus = appointment.status;

    if (dto.scheduledAt != null) {
      const scheduledAt = new Date(dto.scheduledAt);
      if (scheduledAt <= new Date()) {
        throw new BadRequestException('scheduledAt must be a future date');
      }
      appointment.scheduledAt = scheduledAt;
    }
    if (dto.status != null) {
      appointment.status = dto.status;
    }
    if (dto.notes !== undefined) {
      appointment.notes = dto.notes;
    }
    const updated = await this.appointmentRepository.save(appointment);

    if (dto.status != null && dto.status !== previousStatus) {
      await this.sendStatusChangeEmail(updated);
      const event: AppointmentStatusChangedEvent = {
        appointmentId: updated.id,
        listingId: updated.listingId,
        listingTitle: updated.listing?.title ?? null,
        userId: updated.userId,
        newStatus: updated.status,
      };
      this.eventEmitter.emit(LISTING_DOMAIN_EVENTS.APPOINTMENT_STATUS_CHANGED, event);
    }

    return updated;
  }

  private async assertCanUpdate(appointment: Appointment, user: IUser): Promise<void> {
    if (hasPermission(user, PERMISSIONS.APPOINTMENTS_MANAGE_ANY)) {
      return;
    }
    if (appointment.userId === user.id) {
      return;
    }
    const listing = await this.listingRepository.findOne({ where: { id: appointment.listingId } });
    if (listing?.userId === user.id) {
      return;
    }
    throw new NotFoundException('Appointment not found');
  }

  private async sendStatusChangeEmail(appointment: Appointment): Promise<void> {
    if (!appointment.user?.email) {
      return;
    }
    const scheduledDate = appointment.scheduledAt.toISOString().replace('T', ' ').slice(0, 16);
    const listingTitle = appointment.listing?.title ?? 'your listing';

    await this.mailerService.sendMail({
      to: appointment.user.email,
      subject: `Your appointment status changed to "${appointment.status}"`,
      html: `
        <p>Hello ${appointment.user.name},</p>
        <p>Your appointment for <strong>${listingTitle}</strong> scheduled on <strong>${scheduledDate}</strong> has been updated.</p>
        <p>New status: <strong>${appointment.status}</strong></p>
        ${appointment.notes ? `<p>Notes: ${appointment.notes}</p>` : ''}
      `,
    });
  }
}
