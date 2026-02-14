import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { SetRatingUseCase } from '../use-cases/set-rating.use-case';
import { GetListingRatingUseCase } from '../use-cases/get-listing-rating.use-case';
import { CreateRatingRequestDto } from '../dto/request/create-rating.dto';
import { RatingResponseDto } from '../dto/response/rating-response.dto';
import { ListingRatingSummaryResponseDto } from '../dto/response/listing-rating-summary-response.dto';

@Controller('listings/:listingId/ratings')
export class RatingController {
  constructor(
    private readonly setRatingUseCase: SetRatingUseCase,
    private readonly getListingRatingUseCase: GetListingRatingUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async get(@Param('listingId') listingId: string): Promise<ListingRatingSummaryResponseDto> {
    const result = await this.getListingRatingUseCase.execute(listingId);
    return new ListingRatingSummaryResponseDto(result.avg, result.count);
  }

  @RequirePermissions(PERMISSIONS.RATINGS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async set(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() request: CreateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.setRatingUseCase.execute(listingId, user, request);
    return new RatingResponseDto(rating);
  }
}
