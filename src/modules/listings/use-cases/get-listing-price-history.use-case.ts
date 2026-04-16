import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingPriceHistory } from '../entities/listing-price-history.entity';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';

@Injectable()
export class GetListingPriceHistoryUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingPriceHistory)
    private readonly listingPriceHistoryRepository: Repository<ListingPriceHistory>,
  ) {}

  async execute(listingId: string, user: IUser): Promise<ListingPriceHistory[]> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const isOwner = listing.userId === user.id;
    if (!hasPermission(user, PERMISSIONS.LISTINGS_STATS_READ_ANY) && !isOwner) {
      throw new NotFoundException('Listing not found');
    }

    return this.listingPriceHistoryRepository.find({
      where: { listingId },
      order: { changedAt: 'DESC' },
    });
  }
}
