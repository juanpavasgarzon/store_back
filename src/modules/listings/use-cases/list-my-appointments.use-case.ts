import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import type { IUser } from '../../../shared';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListMyAppointmentsUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async execute(user: IUser, query: PaginationQuery): Promise<PaginationResult<Appointment>> {
    const qb = this.appointmentRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.listing', 'l')
      .where('a.userId = :userId', { userId: user.id });

    return paginate<Appointment>(qb, query, {
      defaultSort: [{ field: 'scheduledAt', order: SortOrder.ASC }],
      maxFilterDepth: 2,
    });
  }
}
