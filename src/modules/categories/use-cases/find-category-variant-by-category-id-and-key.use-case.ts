import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';

@Injectable()
export class FindCategoryVariantByCategoryIdAndKeyUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
  ) {}

  async execute(categoryId: string, key: string): Promise<CategoryVariant | null> {
    return this.categoryVariantRepository.findOne({ where: { categoryId, key } });
  }
}
