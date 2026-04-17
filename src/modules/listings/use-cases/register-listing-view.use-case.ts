import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingView } from '../entities/listing-view.entity';

const VIEW_DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class RegisterListingViewUseCase {
  constructor(
    @InjectRepository(ListingView)
    private readonly listingViewRepository: Repository<ListingView>,
  ) {}

  async execute(listingId: string, userId: string | null, ipAddress: string | null): Promise<void> {
    if (userId === null && ipAddress === null) {
      return;
    }

    const windowStart = new Date(Date.now() - VIEW_DEDUP_WINDOW_MS);
    const alreadyViewed = await this.hasRecentView(listingId, userId, ipAddress, windowStart);

    if (alreadyViewed) {
      return;
    }

    const view = this.listingViewRepository.create({ listingId, userId, ipAddress });
    await this.listingViewRepository.save(view);
  }

  private async hasRecentView(
    listingId: string,
    userId: string | null,
    ipAddress: string | null,
    windowStart: Date,
  ): Promise<boolean> {
    const queryBuilder = this.listingViewRepository
      .createQueryBuilder('view')
      .where('view.listingId = :listingId', { listingId })
      .andWhere('view.viewedAt > :windowStart', { windowStart });

    if (userId !== null) {
      queryBuilder.andWhere('view.userId = :userId', { userId });
    } else {
      queryBuilder.andWhere('view.ipAddress = :ipAddress', { ipAddress });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }
}
