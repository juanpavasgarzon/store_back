import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { FindCategoryByIdUseCase } from './find-category-by-id.use-case';
import { FindCategoryBySlugUseCase } from './find-category-by-slug.use-case';
import type { UpdateCategoryRequest } from '../dto/request/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly findCategoryBySlugUseCase: FindCategoryBySlugUseCase,
  ) {}

  async execute(id: string, request: UpdateCategoryRequest): Promise<Category> {
    const category = await this.findCategoryByIdUseCase.execute(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (request.slug != null && request.slug !== category.slug) {
      const existing = await this.findCategoryBySlugUseCase.execute(request.slug);
      if (existing) {
        throw new ConflictException('Category slug already exists');
      }
      category.slug = request.slug;
    }
    if (request.name != null) {
      category.name = request.name;
    }
    if (request.description !== undefined) {
      category.description = request.description;
    }
    return this.categoryRepository.save(category);
  }
}
