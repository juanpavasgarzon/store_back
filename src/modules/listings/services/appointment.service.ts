import { Injectable } from '@nestjs/common';
import { ListMyAppointmentsUseCase } from '../use-cases/list-my-appointments.use-case';
import type { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class AppointmentService {
  constructor(private readonly listMyAppointmentsUseCase: ListMyAppointmentsUseCase) {}

  listMyAppointments(user: IUser): Promise<Appointment[]> {
    return this.listMyAppointmentsUseCase.execute(user);
  }
}
