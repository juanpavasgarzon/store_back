import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { MailerService } from '../../mailer/mailer.service';
import type { IUser } from '../../../shared';
import { ROLES } from '../../../shared/security';
import type { UpdateAppointmentRequestDto } from '../dto/request/update-appointment.dto';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly mailerService: MailerService,
  ) {}

  async execute(id: string, user: IUser, dto: UpdateAppointmentRequestDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['listing', 'user'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const isPrivileged = user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
    if (!isPrivileged && appointment.userId !== user.id) {
      throw new NotFoundException('Appointment not found');
    }

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
    }

    return updated;
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
