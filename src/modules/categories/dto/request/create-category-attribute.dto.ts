import {
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  IsArray,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { ATTRIBUTE_VALUE_TYPE, type AttributeValueType } from '../../constants/attribute-value-type.constants';

export class CreateCategoryAttributeRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  key!: string;

  @IsIn(Object.values(ATTRIBUTE_VALUE_TYPE))
  valueType!: AttributeValueType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50)
  options?: string[];

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}
