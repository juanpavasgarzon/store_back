import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';
import { FindCategoryByIdUseCase } from './find-category-by-id.use-case';
import { FindCategoryVariantByCategoryIdAndKeyUseCase } from './find-category-variant-by-category-id-and-key.use-case';
import type { CreateCategoryVariantRequestDto } from '../dto/request/create-variant.dto';

@Injectable()
export class CreateCategoryVariantUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
    private readonly findCategoryVariantByCategoryIdAndKeyUseCase: FindCategoryVariantByCategoryIdAndKeyUseCase,
  ) {}

  async execute(
    categoryId: string,
    dto: CreateCategoryVariantRequestDto,
  ): Promise<CategoryVariant> {
    const category = await this.findCategoryByIdUseCase.execute(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const existing = await this.findCategoryVariantByCategoryIdAndKeyUseCase.execute(
      categoryId,
      dto.key,
    );
    if (existing) {
      throw new ConflictException('Variant key already exists for this category');
    }
    const variant = this.categoryVariantRepository.create({
      categoryId,
      name: dto.name,
      key: dto.key,
      valueType: dto.valueType ?? 'text',
    });
    return this.categoryVariantRepository.save(variant);
  }
}
