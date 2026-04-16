import type { Favorite } from '../../entities/favorite.entity';
import { ListingResponseDto } from './listing-response.dto';

export class FavoriteResponseDto {
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;
  listing?: ListingResponseDto;

  constructor(favorite: Favorite) {
    this.id = favorite.id;
    this.userId = favorite.userId;
    this.listingId = favorite.listingId;
    this.createdAt = favorite.createdAt;
    if (favorite.listing) {
      this.listing = new ListingResponseDto(favorite.listing);
    }
  }
}
