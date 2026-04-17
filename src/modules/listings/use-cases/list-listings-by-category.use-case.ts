import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';
import type { ListingsPriceFilter } from './list-listings.use-case';

@Injectable()
export class ListListingsByCategoryUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(
    categoryId: string,
    query: PaginationQuery,
    priceFilter: ListingsPriceFilter = {},
  ): Promise<PaginationResult<Listing>> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.categoryId = :categoryId', { categoryId });

    if (priceFilter.minPrice != null) {
      qb.andWhere('l.price >= :minPrice', { minPrice: priceFilter.minPrice });
    }
    if (priceFilter.maxPrice != null) {
      qb.andWhere('l.price <= :maxPrice', { maxPrice: priceFilter.maxPrice });
    }

    const paginationQuery = this.applySearch(qb, query);

    return paginate<Listing>(qb, paginationQuery, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }

  private applySearch(qb: SelectQueryBuilder<Listing>, query: PaginationQuery): PaginationQuery {
    if (!query.search?.trim()) {
      return query;
    }
    const term = query.search.trim();
    qb.andWhere(
      `(
        l.title ILIKE :searchLike
        OR l.description ILIKE :searchLike
        OR l.location ILIKE :searchLike
        OR EXISTS (
          SELECT 1 FROM listing_attribute_values av_s
          WHERE av_s."listingId" = l.id AND av_s.value ILIKE :searchLike
        )
      )`,
      { searchLike: `%${term}%` },
    );
    return { ...query, search: undefined };
  }
}
