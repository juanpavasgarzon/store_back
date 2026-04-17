import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

const SEARCH_LIMIT = 10;

export interface CategorySearchResult {
  id: string;
  name: string;
  slug: string;
}

@Injectable()
export class SearchCategoriesByTermUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(term: string): Promise<CategorySearchResult[]> {
    const likeTerm = `%${term.toLowerCase()}%`;
    return this.categoryRepository
      .createQueryBuilder('c')
      .select(['c.id', 'c.name', 'c.slug'])
      .where('c.isActive = true')
      .andWhere('LOWER(c.name) LIKE :term', { term: likeTerm })
      .orderBy('c.name', 'ASC')
      .take(SEARCH_LIMIT)
      .getMany();
  }
}
