import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { Favorite } from '../entities/favorite.entity';
import { Rating } from '../entities/rating.entity';
import type { ListingWithContext } from './get-listing.use-case';

@Injectable()
export class GetListingByCodeUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async execute(code: string, userId?: string | null): Promise<ListingWithContext> {
    const listing = await this.listingRepository.findOne({
      where: { code },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!userId) {
      return { listing, context: undefined };
    }

    const [favorite, rating] = await Promise.all([
      this.favoriteRepository.findOne({ where: { listingId: listing.id, userId } }),
      this.ratingRepository.findOne({ where: { listingId: listing.id, userId } }),
    ]);

    return {
      listing,
      context: {
        isFavorited: favorite !== null,
        myRating: rating?.score ?? null,
      },
    };
  }
}
