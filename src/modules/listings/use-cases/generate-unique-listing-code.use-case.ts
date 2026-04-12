import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';

@Injectable()
export class GenerateUniqueListingCodeUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(length: number = 8): Promise<string> {
    let attempts = 0;
    while (attempts < 100) {
      const code = this.randomCode(length);
      const exists = await this.listingRepository.count({ where: { code } });
      if (exists === 0) {
        return code;
      }
      attempts++;
    }
    throw new Error('Unable to generate unique listing code after 100 attempts');
  }

  private randomCode(length: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
