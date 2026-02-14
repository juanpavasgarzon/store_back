import { PartialType } from '@nestjs/mapped-types';
import { CreateListingRequestDto } from './create-listing.dto';

export class UpdateListingRequestDto extends PartialType(CreateListingRequestDto) {}
