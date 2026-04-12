import type { ListingPriceHistory } from '../../entities/listing-price-history.entity';

export class ListingPriceHistoryResponseDto {
  id: string;
  listingId: string;
  price: string;
  changedByUserId: string | null;
  changedAt: Date;

  constructor(history: ListingPriceHistory) {
    this.id = history.id;
    this.listingId = history.listingId;
    this.price = history.price;
    this.changedByUserId = history.changedByUserId;
    this.changedAt = history.changedAt;
  }
}
