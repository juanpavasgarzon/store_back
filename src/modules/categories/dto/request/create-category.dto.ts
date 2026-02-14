import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryRequest {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}
