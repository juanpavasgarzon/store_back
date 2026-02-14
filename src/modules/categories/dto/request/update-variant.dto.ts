import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryVariantRequestDto } from './create-variant.dto';

export class UpdateCategoryVariantRequestDto extends PartialType(CreateCategoryVariantRequestDto) {}
