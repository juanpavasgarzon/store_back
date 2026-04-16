import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingView } from '../entities/listing-view.entity';
import { Favorite } from '../entities/favorite.entity';
import { Rating } from '../entities/rating.entity';
import { ContactRequest } from '../entities/contact-request.entity';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import type { ListingStatsResponseDto } from '../dto/response/listing-stats-response.dto';

@Injectable()
export class GetListingStatsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingView)
    private readonly listingViewRepository: Repository<ListingView>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
  ) {}

  async execute(listingId: string, user: IUser): Promise<ListingStatsResponseDto> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const isOwner = listing.userId === user.id;
    if (!hasPermission(user, PERMISSIONS.LISTINGS_STATS_READ_ANY) && !isOwner) {
      throw new NotFoundException('Listing not found');
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalViews, viewsLast7Days, viewsLast30Days, uniqueViewers, favoritesCount] =
      await Promise.all([
        this.listingViewRepository.count({ where: { listingId } }),
        this.listingViewRepository
          .createQueryBuilder('v')
          .where('v.listingId = :listingId', { listingId })
          .andWhere('v.viewedAt >= :since', { since: sevenDaysAgo })
          .getCount(),
        this.listingViewRepository
          .createQueryBuilder('v')
          .where('v.listingId = :listingId', { listingId })
          .andWhere('v.viewedAt >= :since', { since: thirtyDaysAgo })
          .getCount(),
        this.listingViewRepository
          .createQueryBuilder('v')
          .select('COUNT(DISTINCT COALESCE(v."userId"::text, v."ipAddress"))', 'count')
          .where('v.listingId = :listingId', { listingId })
          .getRawOne<{ count: string }>(),
        this.favoriteRepository.count({ where: { listingId } }),
      ]);

    const ratingResult = await this.ratingRepository
      .createQueryBuilder('r')
      .select('AVG(r.score)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.listingId = :listingId', { listingId })
      .getRawOne<{ avg: string | null; count: string }>();

    const contactRequestsCount = await this.contactRequestRepository.count({
      where: { listingId },
    });

    return {
      listingId,
      totalViews,
      viewsLast7Days,
      viewsLast30Days,
      uniqueViewers: parseInt(uniqueViewers?.count ?? '0', 10),
      favoritesCount,
      averageRating: ratingResult?.avg != null ? parseFloat(ratingResult.avg) : 0,
      ratingsCount: parseInt(ratingResult?.count ?? '0', 10),
      contactRequestsCount,
    };
  }
}
