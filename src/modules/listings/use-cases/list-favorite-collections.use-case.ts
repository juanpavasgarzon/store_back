import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCollection } from '../entities/favorite-collection.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class ListFavoriteCollectionsUseCase {
  constructor(
    @InjectRepository(FavoriteCollection)
    private readonly favoriteCollectionRepository: Repository<FavoriteCollection>,
  ) {}

  async execute(user: IUser): Promise<FavoriteCollection[]> {
    return this.favoriteCollectionRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }
}
