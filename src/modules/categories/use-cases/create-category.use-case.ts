import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { FindCategoryBySlugUseCase } from './find-category-by-slug.use-case';
import type { CreateCategoryRequest } from '../dto/request/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly findCategoryBySlugUseCase: FindCategoryBySlugUseCase,
  ) {}

  async execute(request: CreateCategoryRequest): Promise<Category> {
    const existing = await this.findCategoryBySlugUseCase.execute(request.slug);
    if (existing) {
      throw new ConflictException('Category slug already exists');
    }
    const category = this.categoryRepository.create({
      name: request.name,
      slug: request.slug,
      description: request.description,
    });
    return this.categoryRepository.save(category);
  }
}
