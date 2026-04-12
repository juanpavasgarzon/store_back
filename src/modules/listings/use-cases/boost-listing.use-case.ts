import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import type { BoostListingRequestDto } from '../dto/request/boost-listing.dto';

@Injectable()
export class BoostListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string, dto: BoostListingRequestDto): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const expiresAt = new Date(dto.expiresAt);
    if (expiresAt <= new Date()) {
      throw new BadRequestException('expiresAt must be a future date');
    }
    listing.isBoosted = true;
    listing.boostedUntil = expiresAt;
    return this.listingRepository.save(listing);
  }
}
