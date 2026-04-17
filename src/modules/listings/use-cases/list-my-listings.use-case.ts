import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListMyListingsUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(user: IUser, query: PaginationQuery): Promise<PaginationResult<Listing>> {
    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.userId = :userId', { userId: user.id });

    return paginate<Listing>(qb, query, {
      searchFields: ['title', 'description', 'location'],
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }
}
