import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoryVariant } from '../entities/category-variant.entity';

@Injectable()
export class FindCategoryVariantsByIdsUseCase {
  constructor(
    @InjectRepository(CategoryVariant)
    private readonly categoryVariantRepository: Repository<CategoryVariant>,
  ) {}

  async execute(ids: string[]): Promise<CategoryVariant[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.categoryVariantRepository.findBy({ id: In(ids) });
  }
}
