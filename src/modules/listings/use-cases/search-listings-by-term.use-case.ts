import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';

const SEARCH_LIMIT = 10;

export interface ListingSearchResult {
  id: string;
  title: string;
}

@Injectable()
export class SearchListingsByTermUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(term: string): Promise<ListingSearchResult[]> {
    const likeTerm = `%${term.toLowerCase()}%`;
    return this.listingRepository
      .createQueryBuilder('l')
      .select(['l.id', 'l.title'])
      .where('l.isActive = true')
      .andWhere('l.status = :status', { status: LISTING_STATUS.ACTIVE })
      .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())')
      .andWhere(
        `(
          LOWER(l.title) LIKE :term
          OR LOWER(l.description) LIKE :term
          OR EXISTS (
            SELECT 1 FROM listing_attribute_values av_s
            WHERE av_s."listingId" = l.id AND LOWER(av_s.value) LIKE :term
          )
        )`,
        { term: likeTerm },
      )
      .orderBy('l.createdAt', 'DESC')
      .take(SEARCH_LIMIT)
      .getMany();
  }
}
