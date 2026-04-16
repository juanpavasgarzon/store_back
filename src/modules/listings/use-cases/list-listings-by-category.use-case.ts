import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListListingsByCategoryUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(categoryId: string, query: PaginationQuery): Promise<PaginationResult<Listing>> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const qb = this.listingRepository
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.category', 'c')
      .leftJoinAndSelect('l.photos', 'p')
      .where('l.categoryId = :categoryId', { categoryId });

    return paginate<Listing>(qb, query, {
      searchFields: ['l.title', 'l.description', 'l.location'],
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }
}
