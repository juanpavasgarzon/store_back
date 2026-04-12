import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListPublicCategoriesUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(query: PaginationQuery): Promise<PaginationResult<Category>> {
    const qb = this.categoryRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.variants', 'v')
      .where('c.isActive = true');

    return paginate<Category>(qb, query, {
      defaultSort: [{ field: 'name', order: SortOrder.ASC }],
      maxFilterDepth: 2,
    });
  }
}
