import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export type SearchType = 'listing' | 'category';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  q!: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value : 'listing,category',
  )
  type: string = 'listing,category';

  get types(): SearchType[] {
    return this.type.split(',').filter((t): t is SearchType => t === 'listing' || t === 'category');
  }
}
