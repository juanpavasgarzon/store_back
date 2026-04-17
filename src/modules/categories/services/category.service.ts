import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CategoryAttribute } from '../entities/category-attribute.entity';
import { FindCategoryByIdUseCase } from '../use-cases/find-category-by-id.use-case';
import { FindCategoryAttributesByCategoryIdUseCase } from '../use-cases/find-category-attributes-by-category-id.use-case';
import {
  SearchCategoriesByTermUseCase,
  type CategorySearchResult,
} from '../use-cases/search-categories-by-term.use-case';

@Injectable()
export class CategoryService {
  constructor(
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly findCategoryAttributesByCategoryIdUseCase: FindCategoryAttributesByCategoryIdUseCase,
    private readonly searchCategoriesByTermUseCase: SearchCategoriesByTermUseCase,
  ) {}

  findById(id: string): Promise<Category | null> {
    return this.findCategoryByIdUseCase.execute(id);
  }

  findAttributesByCategoryId(categoryId: string): Promise<CategoryAttribute[]> {
    return this.findCategoryAttributesByCategoryIdUseCase.execute(categoryId);
  }

  searchByTerm(term: string): Promise<CategorySearchResult[]> {
    return this.searchCategoriesByTermUseCase.execute(term);
  }
}
