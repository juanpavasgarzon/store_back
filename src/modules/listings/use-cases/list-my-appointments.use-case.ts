import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class ListMyAppointmentsUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async execute(user: IUser): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { userId: user.id },
      relations: ['listing'],
      order: { scheduledAt: 'ASC' },
    });
  }
}
