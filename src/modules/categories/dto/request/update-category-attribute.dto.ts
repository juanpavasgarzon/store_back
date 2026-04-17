import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryAttributeRequest } from './create-category-attribute.dto';

export class UpdateCategoryAttributeRequest extends PartialType(CreateCategoryAttributeRequest) {}
