import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

const DEFAULT_RADIUS_KM = 10;
const EARTH_RADIUS_KM = 6371;

@Injectable()
export class ListNearbyListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(
    lat: number,
    lng: number,
    radiusKm: number = DEFAULT_RADIUS_KM,
    query: PaginationQuery,
  ): Promise<PaginationResult<Listing>> {
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('lat must be between -90 and 90');
    }
    if (lng < -180 || lng > 180) {
      throw new BadRequestException('lng must be between -180 and 180');
    }
    if (radiusKm <= 0 || radiusKm > 500) {
      throw new BadRequestException('radius must be between 1 and 500 km');
    }

    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.status = :status', { status: LISTING_STATUS.ACTIVE })
      .andWhere('(l.expiresAt IS NULL OR l.expiresAt > NOW())')
      .andWhere('l.latitude IS NOT NULL')
      .andWhere('l.longitude IS NOT NULL')
      .andWhere(
        `(${EARTH_RADIUS_KM} * acos(
          cos(radians(:lat)) * cos(radians(CAST(l.latitude AS DOUBLE PRECISION)))
          * cos(radians(CAST(l.longitude AS DOUBLE PRECISION)) - radians(:lng))
          + sin(radians(:lat)) * sin(radians(CAST(l.latitude AS DOUBLE PRECISION)))
        )) <= :radiusKm`,
        { lat, lng, radiusKm },
      );

    return paginate<Listing>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
    });
  }
}
