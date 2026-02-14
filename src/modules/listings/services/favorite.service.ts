import { Injectable } from '@nestjs/common';
import { ListMyFavoritesUseCase } from '../use-cases/list-my-favorites.use-case';
import type { Favorite } from '../entities/favorite.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class FavoriteService {
  constructor(private readonly listMyFavoritesUseCase: ListMyFavoritesUseCase) {}

  listMyFavorites(user: IUser): Promise<Favorite[]> {
    return this.listMyFavoritesUseCase.execute(user);
  }
}
