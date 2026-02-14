import { Injectable, NotFoundException } from '@nestjs/common';
import { FindCategoryByIdUseCase } from './find-category-by-id.use-case';
import { FindCategoryVariantsByCategoryIdUseCase } from './find-category-variants-by-category-id.use-case';
import type { CategoryVariant } from '../entities/category-variant.entity';

@Injectable()
export class ListVariantsByCategoryUseCase {
  constructor(
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly findCategoryVariantsByCategoryIdUseCase: FindCategoryVariantsByCategoryIdUseCase,
  ) {}

  async execute(categoryId: string): Promise<CategoryVariant[]> {
    const category = await this.findCategoryByIdUseCase.execute(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.findCategoryVariantsByCategoryIdUseCase.execute(categoryId);
  }
}
