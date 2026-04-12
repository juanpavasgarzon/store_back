import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class ExpireListingBoostsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(): Promise<number> {
    const result = await this.listingRepository.update(
      {
        isBoosted: true,
        boostedUntil: LessThanOrEqual(new Date()),
      },
      { isBoosted: false, boostedUntil: null },
    );
    return result.affected ?? 0;
  }
}
