import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';

@Injectable()
export class FindCategoryVariantsByCategoryIdUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
  ) {}

  async execute(categoryId: string): Promise<CategoryVariant[]> {
    return this.categoryVariantRepository.find({
      where: { categoryId },
      order: { name: 'ASC' },
    });
  }
}
