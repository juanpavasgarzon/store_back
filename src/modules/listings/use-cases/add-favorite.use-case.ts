import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(listingId: string, user: IUser): Promise<Favorite> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const existing = await this.favoriteRepository.findOne({
      where: { userId: user.id, listingId },
    });
    if (existing) {
      throw new ConflictException('Favorite already exists');
    }
    const favorite = this.favoriteRepository.create({ userId: user.id, listingId });
    return this.favoriteRepository.save(favorite);
  }
}
