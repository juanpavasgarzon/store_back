import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class GetMyRatingForListingUseCase {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async execute(listingId: string, userId: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({ where: { listingId, userId } });
  }
}
