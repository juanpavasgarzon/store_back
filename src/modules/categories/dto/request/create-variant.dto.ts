import { IsString, IsOptional, IsIn, IsArray, MaxLength } from 'class-validator';
import { VARIANT_VALUE_TYPE } from '../../constants/variant-value-type.constants';
import type { VariantValueType } from '../../constants/variant-value-type.constants';

export class CreateCategoryVariantRequestDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  @MaxLength(50)
  key: string;

  @IsOptional()
  @IsIn(Object.values(VARIANT_VALUE_TYPE))
  valueType?: VariantValueType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}
