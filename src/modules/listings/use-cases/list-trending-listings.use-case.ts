import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';

export type TrendingPeriod = '24h' | '7d';

const PERIOD_HOURS: Record<TrendingPeriod, number> = {
  '24h': 24,
  '7d': 168,
};

const DEFAULT_TRENDING_LIMIT = 10;
const MAX_TRENDING_LIMIT = 50;
const WEIGHT_VIEWS = 1;
const WEIGHT_CONTACTS = 5;
const WEIGHT_FAVORITES = 3;

@Injectable()
export class ListTrendingListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(
    period: TrendingPeriod = '7d',
    limit: number = DEFAULT_TRENDING_LIMIT,
  ): Promise<Listing[]> {
    const safeLimit = Math.min(limit, MAX_TRENDING_LIMIT);
    const hours = PERIOD_HOURS[period];
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.status = :status', { status: LISTING_STATUS.ACTIVE })
      .andWhere('l.isActive = :isActive', { isActive: true })
      .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())')
      .addSelect(
        `(
          (SELECT COUNT(*) FROM listing_views lv WHERE lv."listingId" = l.id AND lv."viewedAt" >= :since) * ${WEIGHT_VIEWS}
          + (SELECT COUNT(*) FROM contact_requests cr WHERE cr."listingId" = l.id AND cr."createdAt" >= :since) * ${WEIGHT_CONTACTS}
          + (SELECT COUNT(*) FROM favorites fv WHERE fv."listingId" = l.id AND fv."createdAt" >= :since) * ${WEIGHT_FAVORITES}
        )`,
        'score',
      )
      .setParameter('since', since)
      .orderBy('score', 'DESC')
      .addOrderBy('l.createdAt', 'DESC')
      .limit(safeLimit)
      .getMany();
  }
}
