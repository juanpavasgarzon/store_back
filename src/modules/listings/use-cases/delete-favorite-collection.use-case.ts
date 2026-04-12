import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCollection } from '../entities/favorite-collection.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class DeleteFavoriteCollectionUseCase {
  constructor(
    @InjectRepository(FavoriteCollection)
    private readonly favoriteCollectionRepository: Repository<FavoriteCollection>,
  ) {}

  async execute(id: string, user: IUser): Promise<void> {
    const collection = await this.favoriteCollectionRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    await this.favoriteCollectionRepository.remove(collection);
  }
}
