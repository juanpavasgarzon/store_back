import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { LISTING_STATUS, type ListingStatus } from '../../constants/listing-status.constants';
import { Type } from 'class-transformer';

export class AttributeValueInput {
  @IsUUID()
  attributeId!: string;

  @IsString()
  value!: string;
}

export class CreateListingRequestDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @MaxLength(120)
  location!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  sector?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsIn(Object.values(LISTING_STATUS))
  status?: ListingStatus;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueInput)
  attributeValues?: AttributeValueInput[];
}
