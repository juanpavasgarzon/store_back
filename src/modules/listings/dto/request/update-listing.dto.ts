import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { CreateListingRequestDto } from './create-listing.dto';
import { LISTING_STATUS, type ListingStatus } from '../../constants/listing-status.constants';

export class UpdateListingRequestDto extends PartialType(CreateListingRequestDto) {
  @IsOptional()
  @IsIn(Object.values(LISTING_STATUS))
  status?: ListingStatus;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}
