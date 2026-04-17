import type { Category } from '../../entities/category.entity';
import { CategoryAttributeResponse } from './category-attribute-response.dto';

export class CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  attributes: CategoryAttributeResponse[];

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description ?? null;
    this.isActive = category.isActive;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
    this.attributes = (category.attributes ?? [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((attribute) => new CategoryAttributeResponse(attribute));
  }
}
