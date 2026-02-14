import type { Favorite } from '../../entities/favorite.entity';

export class FavoriteResponseDto {
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;

  constructor(favorite: Favorite) {
    this.id = favorite.id;
    this.userId = favorite.userId;
    this.listingId = favorite.listingId;
    this.createdAt = favorite.createdAt;
  }
}
