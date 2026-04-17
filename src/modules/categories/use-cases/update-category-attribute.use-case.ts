import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryAttribute } from '../entities/category-attribute.entity';
import type { UpdateCategoryAttributeRequest } from '../dto/request/update-category-attribute.dto';

@Injectable()
export class UpdateCategoryAttributeUseCase {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,
  ) {}

  async execute(
    categoryId: string,
    attributeId: string,
    dto: UpdateCategoryAttributeRequest,
  ): Promise<CategoryAttribute> {
    const attribute = await this.categoryAttributeRepository.findOne({
      where: { id: attributeId, categoryId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    Object.assign(attribute, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.key !== undefined && { key: dto.key }),
      ...(dto.valueType !== undefined && { valueType: dto.valueType }),
      ...(dto.options !== undefined && { options: dto.options }),
      ...(dto.isRequired !== undefined && { isRequired: dto.isRequired }),
    });

    return this.categoryAttributeRepository.save(attribute);
  }
}
