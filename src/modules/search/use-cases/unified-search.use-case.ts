import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { Category } from '../../categories/entities/category.entity';
import { LISTING_STATUS } from '../../listings/constants/listing-status.constants';
import { SearchResultItemDto } from '../dto/response/search-result.dto';
import type { SearchType } from '../dto/request/search-query.dto';

const SEARCH_LIMIT = 10;

@Injectable()
export class UnifiedSearchUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(query: string, types: SearchType[]): Promise<SearchResultItemDto[]> {
    const term = `%${query.toLowerCase()}%`;
    const results: SearchResultItemDto[] = [];

    if (types.includes('listing')) {
      const listings = await this.listingRepository
        .createQueryBuilder('l')
        .select(['l.id', 'l.title'])
        .where('l.isActive = true')
        .andWhere('l.status = :status', { status: LISTING_STATUS.ACTIVE })
        .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())')
        .andWhere('(LOWER(l.title) LIKE :term OR LOWER(l.description) LIKE :term)', { term })
        .orderBy('l.createdAt', 'DESC')
        .take(SEARCH_LIMIT)
        .getMany();

      for (const listing of listings) {
        results.push(new SearchResultItemDto('listing', listing.id, listing.title, null));
      }
    }

    if (types.includes('category')) {
      const categories = await this.categoryRepository
        .createQueryBuilder('c')
        .select(['c.id', 'c.name', 'c.slug'])
        .where('c.isActive = true')
        .andWhere('LOWER(c.name) LIKE :term', { term })
        .orderBy('c.name', 'ASC')
        .take(SEARCH_LIMIT)
        .getMany();

      for (const category of categories) {
        results.push(
          new SearchResultItemDto('category', category.id, category.name, category.slug),
        );
      }
    }

    return results;
  }
}
