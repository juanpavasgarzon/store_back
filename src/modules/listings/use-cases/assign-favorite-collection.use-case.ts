import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { FavoriteCollection } from '../entities/favorite-collection.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class AssignFavoriteCollectionUseCase {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(FavoriteCollection)
    private readonly favoriteCollectionRepository: Repository<FavoriteCollection>,
  ) {}

  async execute(listingId: string, user: IUser, collectionId: string | null): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findOne({
      where: { listingId, userId: user.id },
    });
    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    if (collectionId !== null) {
      const collection = await this.favoriteCollectionRepository.findOne({
        where: { id: collectionId, userId: user.id },
      });
      if (!collection) {
        throw new BadRequestException('Collection not found or does not belong to you');
      }
    }

    favorite.collectionId = collectionId;
    return this.favoriteRepository.save(favorite);
  }
}
