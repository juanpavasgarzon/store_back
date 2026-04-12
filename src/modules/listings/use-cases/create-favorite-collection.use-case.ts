import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteCollection } from '../entities/favorite-collection.entity';
import type { IUser } from '../../../shared';
import type { CreateFavoriteCollectionRequestDto } from '../dto/request/create-favorite-collection.dto';

@Injectable()
export class CreateFavoriteCollectionUseCase {
  constructor(
    @InjectRepository(FavoriteCollection)
    private readonly favoriteCollectionRepository: Repository<FavoriteCollection>,
  ) {}

  async execute(user: IUser, dto: CreateFavoriteCollectionRequestDto): Promise<FavoriteCollection> {
    const collection = this.favoriteCollectionRepository.create({
      userId: user.id,
      name: dto.name,
    });
    return this.favoriteCollectionRepository.save(collection);
  }
}
