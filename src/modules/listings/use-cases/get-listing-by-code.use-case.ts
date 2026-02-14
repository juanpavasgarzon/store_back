import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class GetListingByCodeUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(code: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { code },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }
}
