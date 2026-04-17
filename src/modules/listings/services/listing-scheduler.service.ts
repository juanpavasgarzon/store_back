import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpireListingsUseCase } from '../use-cases/expire-listings.use-case';

@Injectable()
export class ListingSchedulerService {
  private readonly logger = new Logger(ListingSchedulerService.name);

  constructor(private readonly expireListingsUseCase: ExpireListingsUseCase) {}

  @Cron(CronExpression.EVERY_HOUR)
  async expireListings(): Promise<void> {
    try {
      const count = await this.expireListingsUseCase.execute();
      if (count > 0) {
        this.logger.log(`Expired ${count} listings`);
      }
    } catch (error) {
      this.logger.error('Failed to expire listings', error);
    }
  }
}
