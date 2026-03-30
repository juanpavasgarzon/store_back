import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';
import { ROLES } from '../../../shared/security';

@Injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async execute(id: string, user: IUser): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    const isPrivileged = user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
    if (!isPrivileged && appointment.userId !== user.id) {
      throw new NotFoundException('Appointment not found');
    }
    await this.appointmentRepository.delete(id);
  }
}
