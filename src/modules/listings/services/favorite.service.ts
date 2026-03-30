import { Injectable } from '@nestjs/common';
import { ListMyFavoritesUseCase } from '../use-cases/list-my-favorites.use-case';
import type { Favorite } from '../entities/favorite.entity';
import type { IUser } from '../../../shared';
import type { PaginationQuery, PaginationResult } from '../../../shared/pagination';

@Injectable()
export class FavoriteService {
  constructor(private readonly listMyFavoritesUseCase: ListMyFavoritesUseCase) {}

  listMyFavorites(user: IUser, query: PaginationQuery): Promise<PaginationResult<Favorite>> {
    return this.listMyFavoritesUseCase.execute(user, query);
  }
}
