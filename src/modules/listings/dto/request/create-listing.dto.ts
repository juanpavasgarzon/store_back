import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListingVariantValueDto {
  @IsUUID()
  categoryVariantId: string;

  @IsString()
  value: string;
}

export class CreateListingRequestDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MaxLength(120)
  location: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sector?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingVariantValueDto)
  variants?: ListingVariantValueDto[];
}
