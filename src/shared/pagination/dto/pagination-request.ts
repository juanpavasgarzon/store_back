import { IsOptional, IsString, Min, Max, IsNumber, IsArray, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { PaginationQuery, SortRule } from '../interfaces/pagination-query.interface';
import { parseSortString } from '../utils/parse-query-string.util';

export class PaginationRequest implements PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return parseSortString(value);
    return undefined;
  })
  @IsArray()
  sort?: SortRule[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, Record<string, unknown>>;

  @IsOptional()
  @IsArray()
  $or?: Array<Record<string, Record<string, unknown>>>;

  @IsOptional()
  @IsArray()
  $and?: Array<Record<string, Record<string, unknown>>>;
}
