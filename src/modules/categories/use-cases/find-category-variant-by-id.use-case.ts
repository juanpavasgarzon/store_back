import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';

@Injectable()
export class FindCategoryVariantByIdUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
  ) {}

  async execute(id: string): Promise<CategoryVariant | null> {
    return this.categoryVariantRepository.findOne({ where: { id } });
  }
}
