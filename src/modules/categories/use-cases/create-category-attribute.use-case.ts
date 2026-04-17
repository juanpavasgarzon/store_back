import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryAttribute } from '../entities/category-attribute.entity';
import type { CreateCategoryAttributeRequest } from '../dto/request/create-category-attribute.dto';
import { FindCategoryByIdUseCase } from './find-category-by-id.use-case';

@Injectable()
export class CreateCategoryAttributeUseCase {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
  ) {}

  async execute(categoryId: string, dto: CreateCategoryAttributeRequest): Promise<CategoryAttribute> {
    const category = await this.findCategoryByIdUseCase.execute(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const attribute = this.categoryAttributeRepository.create({
      categoryId,
      name: dto.name,
      key: dto.key,
      valueType: dto.valueType,
      options: dto.options ?? [],
      isRequired: dto.isRequired ?? false,
    });

    return this.categoryAttributeRepository.save(attribute);
  }
}
