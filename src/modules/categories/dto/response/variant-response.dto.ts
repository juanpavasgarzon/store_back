import type { CategoryVariant } from '../../entities/category-variant.entity';

export class VariantResponseDto {
  id: string;
  categoryId: string;
  name: string;
  key: string;
  valueType: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(variant: CategoryVariant) {
    this.id = variant.id;
    this.categoryId = variant.categoryId;
    this.name = variant.name;
    this.key = variant.key;
    this.valueType = variant.valueType;
    this.createdAt = variant.createdAt;
    this.updatedAt = variant.updatedAt;
  }
}
