import { Injectable } from '@nestjs/common';
import { ListMyRatingsUseCase } from '../use-cases/list-my-ratings.use-case';
import type { IUser } from '../../../shared';
import type { PaginationQuery, PaginationResult } from '../../../shared/pagination';
import type { Rating } from '../entities/rating.entity';

@Injectable()
export class RatingService {
  constructor(private readonly listMyRatingsUseCase: ListMyRatingsUseCase) {}

  listMyRatings(user: IUser, query: PaginationQuery): Promise<PaginationResult<Rating>> {
    return this.listMyRatingsUseCase.execute(user, query);
  }
}
