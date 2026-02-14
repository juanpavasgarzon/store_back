import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';

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
    if (appointment.userId !== user.id) {
      throw new NotFoundException('Appointment not found');
    }
    await this.appointmentRepository.delete(id);
  }
}
