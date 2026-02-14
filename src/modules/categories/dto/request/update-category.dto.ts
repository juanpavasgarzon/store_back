import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryRequest } from './create-category.dto';

export class UpdateCategoryRequest extends PartialType(CreateCategoryRequest) {}
