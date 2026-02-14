import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';
import type { UpdateAppointmentRequestDto } from '../dto/request/update-appointment.dto';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async execute(id: string, user: IUser, dto: UpdateAppointmentRequestDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['listing', 'user'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.userId !== user.id) {
      throw new NotFoundException('Appointment not found');
    }
    if (dto.scheduledAt != null) {
      appointment.scheduledAt = new Date(dto.scheduledAt);
    }
    if (dto.status != null) {
      appointment.status = dto.status;
    }
    if (dto.notes !== undefined) {
      appointment.notes = dto.notes;
    }
    return this.appointmentRepository.save(appointment);
  }
}
