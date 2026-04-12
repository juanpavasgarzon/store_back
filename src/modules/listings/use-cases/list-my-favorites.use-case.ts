import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import type { IUser } from '../../../shared';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListMyFavoritesUseCase {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async execute(user: IUser, query: PaginationQuery): Promise<PaginationResult<Favorite>> {
    const qb = this.favoriteRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.listing', 'l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('f.userId = :userId', { userId: user.id });

    return paginate<Favorite>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }
}
