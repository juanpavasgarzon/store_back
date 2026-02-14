import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: PaginationQuery): Promise<PaginationResult<User>> {
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.email', 'u.name', 'u.role', 'u.isActive', 'u.createdAt', 'u.updatedAt']);

    return paginate<User>(qb, query, {
      searchFields: ['email', 'name'],
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
    });
  }
}
