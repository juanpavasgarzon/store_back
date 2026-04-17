import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async execute(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['attributes'],
      order: { attributes: { name: 'ASC' } },
    });
  }
}
