import { IsDateString } from 'class-validator';

export class BoostListingRequestDto {
  @IsDateString()
  expiresAt!: string;
}
