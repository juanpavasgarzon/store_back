import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async execute(listingId: string, user: IUser): Promise<void> {
    const existing = await this.favoriteRepository.findOne({
      where: { userId: user.id, listingId },
    });
    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }
    await this.favoriteRepository.delete(existing.id);
  }
}
