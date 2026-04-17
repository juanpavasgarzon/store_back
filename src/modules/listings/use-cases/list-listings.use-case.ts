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

export interface ListingsPriceFilter {
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class ListListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(
    query: PaginationQuery,
    priceFilter: ListingsPriceFilter = {},
  ): Promise<PaginationResult<Listing>> {
    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.isActive = :isActive', { isActive: true })
      .andWhere('l.status = :status', { status: LISTING_STATUS.ACTIVE })
      .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())');

    if (priceFilter.minPrice != null) {
      qb.andWhere('l.price >= :minPrice', { minPrice: priceFilter.minPrice });
    }
    if (priceFilter.maxPrice != null) {
      qb.andWhere('l.price <= :maxPrice', { maxPrice: priceFilter.maxPrice });
    }

    const paginationQuery = this.applyFullTextSearch(qb, query);

    return paginate<Listing>(qb, paginationQuery, {
      defaultSort: [
        { field: 'createdAt', order: SortOrder.DESC },
        { field: 'isBoosted', order: SortOrder.DESC },
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
    const term = query.search.trim();
    qb.andWhere(
      `(
        l."searchVector" @@ plainto_tsquery('spanish', :searchTerm)
        OR c.name ILIKE :searchLike
        OR EXISTS (
          SELECT 1 FROM listing_attribute_values av_s
          WHERE av_s."listingId" = l.id AND av_s.value ILIKE :searchLike
        )
      )`,
      { searchTerm: term, searchLike: `%${term}%` },
    );
    return { ...query, search: undefined };
  }
}
