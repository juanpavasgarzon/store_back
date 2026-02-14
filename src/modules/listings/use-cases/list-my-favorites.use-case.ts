import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class ListMyFavoritesUseCase {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async execute(user: IUser): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { userId: user.id },
      relations: ['listing', 'listing.category', 'listing.photos'],
      order: { createdAt: 'DESC' },
    });
  }
}
