import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class GetListingRatingUseCase {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string): Promise<{ avg: number; count: number }> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const result = await this.ratingRepository
      .createQueryBuilder('r')
      .select('AVG(r.score)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.listingId = :listingId', { listingId })
      .getRawOne<{ avg: string; count: string }>();
    return {
      avg: result?.avg != null ? parseFloat(result.avg) : 0,
      count: result?.count != null ? parseInt(result.count, 10) : 0,
    };
  }
}
