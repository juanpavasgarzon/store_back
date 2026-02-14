import type { Rating } from '../../entities/rating.entity';

export class RatingResponseDto {
  id: string;
  userId: string;
  listingId: string;
  score: number;
  createdAt: Date;

  constructor(rating: Rating) {
    this.id = rating.id;
    this.userId = rating.userId;
    this.listingId = rating.listingId;
    this.score = rating.score;
    this.createdAt = rating.createdAt;
  }
}
