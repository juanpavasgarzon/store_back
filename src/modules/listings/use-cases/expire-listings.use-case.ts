import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';

@Injectable()
export class ExpireListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(): Promise<number> {
    const result = await this.listingRepository.update(
      {
        status: LISTING_STATUS.ACTIVE,
        expiresAt: LessThan(new Date()),
      },
      { status: LISTING_STATUS.EXPIRED },
    );
    return result.affected ?? 0;
  }
}
