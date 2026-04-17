import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryAttribute } from '../entities/category-attribute.entity';

@Injectable()
export class DeleteCategoryAttributeUseCase {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,
  ) {}

  async execute(categoryId: string, attributeId: string): Promise<void> {
    const attribute = await this.categoryAttributeRepository.findOne({
      where: { id: attributeId, categoryId },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    await this.categoryAttributeRepository.remove(attribute);
  }
}
