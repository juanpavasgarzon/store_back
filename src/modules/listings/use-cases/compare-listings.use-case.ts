import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';

const MAX_COMPARE = 4;

@Injectable()
export class CompareListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(ids: string[]): Promise<Listing[]> {
    if (ids.length < 2 || ids.length > MAX_COMPARE) {
      throw new BadRequestException('Provide between 2 and 4 listing IDs to compare');
    }

    const listings = await this.listingRepository.find({
      where: { id: In(ids) },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });

    return ids.map((id) => {
      const found = listings.find((l) => l.id === id);
      if (!found) {
        throw new BadRequestException(`Listing not found: ${id}`);
      }
      return found;
    });
  }
}
