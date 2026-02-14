import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class FindCategoryBySlugUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(slug: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { slug }, relations: ['variants'] });
  }
}
