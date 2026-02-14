import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryVariantRequestDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  @MaxLength(50)
  key: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  valueType?: string;
}
