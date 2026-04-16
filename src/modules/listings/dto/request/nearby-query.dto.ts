import {
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNumber,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  PaginationQuery,
  SortRule,
} from '../../../../shared/pagination/interfaces/pagination-query.interface';

export class NearbyQueryDto implements PaginationQuery {
  @IsNumberString()
  lat!: string;

  @IsNumberString()
  lng!: string;

  @IsOptional()
  @IsNumberString()
  radius?: string;

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
