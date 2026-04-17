import type { CategoryAttribute } from '../../entities/category-attribute.entity';
import type { AttributeValueType } from '../../constants/attribute-value-type.constants';

export class CategoryAttributeResponse {
  id: string;
  categoryId: string;
  name: string;
  key: string;
  valueType: AttributeValueType;
  options: string[];
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(attribute: CategoryAttribute) {
    this.id = attribute.id;
    this.categoryId = attribute.categoryId;
    this.name = attribute.name;
    this.key = attribute.key;
    this.valueType = attribute.valueType;
    this.options = attribute.options ?? [];
    this.isRequired = attribute.isRequired;
    this.createdAt = attribute.createdAt;
    this.updatedAt = attribute.updatedAt;
  }
}
