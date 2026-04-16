import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { LISTING_STATUS } from '../constants/listing-status.constants';

@Injectable()
export class CountListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(): Promise<number> {
    return this.listingRepository.count({
      where: { isActive: true, status: LISTING_STATUS.ACTIVE },
    });
  }
}
