import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { Favorite } from '../entities/favorite.entity';
import type { ListingUserContext } from '../interfaces/listing-response.interface';

export interface ListingWithContext {
  listing: Listing;
  context: ListingUserContext | undefined;
}

@Injectable()
export class GetListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async execute(id: string, userId?: string | null): Promise<ListingWithContext> {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['category', 'category.attributes', 'photos', 'user', 'attributeValues', 'attributeValues.attribute'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!userId) {
      return { listing, context: undefined };
    }

    const favorite = await this.favoriteRepository.findOne({ where: { listingId: id, userId } });

    return {
      listing,
      context: {
        isFavorited: favorite !== null,
      },
    };
  }
}
