import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryAttribute } from '../entities/category-attribute.entity';

@Injectable()
export class FindCategoryAttributesByCategoryIdUseCase {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,
  ) {}

  execute(categoryId: string): Promise<CategoryAttribute[]> {
    return this.categoryAttributeRepository.find({
      where: { categoryId },
      order: { name: 'ASC' },
    });
  }
}
