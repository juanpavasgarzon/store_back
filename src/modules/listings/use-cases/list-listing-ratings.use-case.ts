import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Listing } from '../entities/listing.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListListingRatingsUseCase {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string, query: PaginationQuery): Promise<PaginationResult<Rating>> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const qb = this.ratingRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .where('r.listingId = :listingId', { listingId });

    return paginate<Rating>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
    });
  }
}
