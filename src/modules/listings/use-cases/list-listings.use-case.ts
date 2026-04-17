import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';
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
      .where('l.isActive = :isActive', { isActive: true })
      .andWhere('l.status = :status', { status: LISTING_STATUS.ACTIVE })
      .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())');

    const paginationQuery = this.applyFullTextSearch(qb, query);

    return paginate<Listing>(qb, paginationQuery, {
      defaultSort: [
        { field: 'isBoosted', order: SortOrder.DESC },
        { field: 'createdAt', order: SortOrder.DESC },
      ],
      maxFilterDepth: 2,
    });
  }

  private applyFullTextSearch(
    qb: SelectQueryBuilder<Listing>,
    query: PaginationQuery,
  ): PaginationQuery {
    if (!query.search?.trim()) {
      return query;
    }
    qb.andWhere(
      `(l."searchVector" @@ plainto_tsquery('spanish', :searchTerm) OR c.name ILIKE :categorySearch)`,
      { searchTerm: query.search.trim(), categorySearch: `%${query.search.trim()}%` },
    );
    return { ...query, search: undefined };
  }
}
