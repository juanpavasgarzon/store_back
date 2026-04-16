import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import type { IUser } from '../../../shared';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListMyRatingsUseCase {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async execute(user: IUser, query: PaginationQuery): Promise<PaginationResult<Rating>> {
    const qb = this.ratingRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.listing', 'l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('r.userId = :userId', { userId: user.id });

    return paginate<Rating>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
    });
  }
}
