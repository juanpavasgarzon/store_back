import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ListingReport } from '../entities/listing-report.entity';
import { Listing } from '../entities/listing.entity';
import { REPORT_STATUS } from '../constants/report-status.constants';
import { LISTING_STATUS } from '../constants/listing-status.constants';
import { REPORT_AUTO_SUSPEND_THRESHOLD } from '../constants/report-moderation.constants';
import { LISTING_DOMAIN_EVENTS, type ListingSuspendedEvent } from '../events';
import type { IUser } from '../../../shared';
import type { CreateListingReportRequestDto } from '../dto/request/create-listing-report.dto';

@Injectable()
export class CreateListingReportUseCase {
  constructor(
    @InjectRepository(ListingReport)
    private readonly listingReportRepository: Repository<ListingReport>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    listingId: string,
    user: IUser,
    dto: CreateListingReportRequestDto,
  ): Promise<ListingReport> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const report = this.listingReportRepository.create({
      userId: user.id,
      listingId,
      reason: dto.reason,
      details: dto.details ?? null,
      status: REPORT_STATUS.PENDING,
    });
    const saved = await this.listingReportRepository.save(report);

    await this.autoSuspendIfThresholdExceeded(listing);

    return saved;
  }

  private async autoSuspendIfThresholdExceeded(listing: Listing): Promise<void> {
    if (listing.status === LISTING_STATUS.SUSPENDED) {
      return;
    }
    const reportCount = await this.listingReportRepository.count({
      where: { listingId: listing.id, status: REPORT_STATUS.PENDING },
    });
    if (reportCount < REPORT_AUTO_SUSPEND_THRESHOLD) {
      return;
    }
    await this.listingRepository.update(listing.id, { status: LISTING_STATUS.SUSPENDED });
    const event: ListingSuspendedEvent = {
      listingId: listing.id,
      listingTitle: listing.title,
      listingOwnerId: listing.userId,
    };
    this.eventEmitter.emit(LISTING_DOMAIN_EVENTS.LISTING_SUSPENDED, event);
  }
}
