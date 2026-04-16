import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';
import { FindCategoryVariantByIdUseCase } from './find-category-variant-by-id.use-case';
import { FindCategoryVariantByCategoryIdAndKeyUseCase } from './find-category-variant-by-category-id-and-key.use-case';
import type { UpdateCategoryVariantRequestDto } from '../dto/request/update-variant.dto';

@Injectable()
export class UpdateCategoryVariantUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
    private readonly findCategoryVariantByIdUseCase: FindCategoryVariantByIdUseCase,
    private readonly findCategoryVariantByCategoryIdAndKeyUseCase: FindCategoryVariantByCategoryIdAndKeyUseCase,
  ) {}

  async execute(id: string, dto: UpdateCategoryVariantRequestDto): Promise<CategoryVariant> {
    const variant = await this.findCategoryVariantByIdUseCase.execute(id);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    if (dto.key != null && dto.key !== variant.key) {
      const existing = await this.findCategoryVariantByCategoryIdAndKeyUseCase.execute(
        variant.categoryId,
        dto.key,
      );
      if (existing) {
        throw new ConflictException('Variant key already exists for this category');
      }
      variant.key = dto.key;
    }
    if (dto.name != null) {
      variant.name = dto.name;
    }
    if (dto.valueType != null) {
      variant.valueType = dto.valueType;
    }
    if (dto.options != null) {
      variant.options = dto.options;
    }
    return this.categoryVariantRepository.save(variant);
  }
}
