import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { FindCategoryByIdUseCase } from '../use-cases/find-category-by-id.use-case';

@Injectable()
export class CategoryService {
  constructor(private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase) {}

  findById(id: string): Promise<Category | null> {
    return this.findCategoryByIdUseCase.execute(id);
  }
}
