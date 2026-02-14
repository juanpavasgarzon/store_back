import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import type { CreateRatingRequestDto } from '../dto/request/create-rating.dto';

@Injectable()
export class SetRatingUseCase {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string, user: IUser, dto: CreateRatingRequestDto): Promise<Rating> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const existing = await this.ratingRepository.findOne({
      where: { userId: user.id, listingId },
    });
    if (existing) {
      existing.score = dto.score;
      return this.ratingRepository.save(existing);
    }
    const rating = this.ratingRepository.create({
      userId: user.id,
      listingId,
      score: dto.score,
    });
    return this.ratingRepository.save(rating);
  }
}
