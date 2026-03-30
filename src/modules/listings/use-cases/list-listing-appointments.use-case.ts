import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListListingAppointmentsUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string, query: PaginationQuery): Promise<PaginationResult<Appointment>> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const qb = this.appointmentRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u')
      .where('a.listingId = :listingId', { listingId });

    return paginate<Appointment>(qb, query, {
      defaultSort: [{ field: 'scheduledAt', order: SortOrder.ASC }],
    });
  }
}
