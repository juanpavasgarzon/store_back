import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';
import { FindCategoryVariantByIdUseCase } from './find-category-variant-by-id.use-case';

@Injectable()
export class DeleteCategoryVariantUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
    private readonly findCategoryVariantByIdUseCase: FindCategoryVariantByIdUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const variant = await this.findCategoryVariantByIdUseCase.execute(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.categoryVariantRepository.delete(id);
  }
}
