import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingReport } from '../entities/listing-report.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListListingReportsUseCase {
  constructor(
    @InjectRepository(ListingReport)
    private readonly listingReportRepository: Repository<ListingReport>,
  ) {}

  async execute(query: PaginationQuery): Promise<PaginationResult<ListingReport>> {
    const qb = this.listingReportRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.listing', 'l')
      .leftJoinAndSelect('r.user', 'u');

    return paginate<ListingReport>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }
}
