import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(query: PaginationQuery): Promise<PaginationResult<Listing>> {
    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .leftJoinAndSelect('l.variants', 'lv')
      .leftJoinAndSelect('lv.categoryVariant', 'cv')
      .where('l.isActive = :isActive', { isActive: true });

    return paginate<Listing>(qb, query, {
      searchFields: ['title', 'description', 'location', 'sector'],
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
    });
  }
}
