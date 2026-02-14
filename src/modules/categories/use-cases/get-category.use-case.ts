import { Injectable, NotFoundException } from '@nestjs/common';
import { FindCategoryByIdUseCase } from './find-category-by-id.use-case';
import type { Category } from '../entities/category.entity';

@Injectable()
export class GetCategoryUseCase {
  constructor(private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase) {}

  async execute(id: string): Promise<Category> {
    const category = await this.findCategoryByIdUseCase.execute(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
