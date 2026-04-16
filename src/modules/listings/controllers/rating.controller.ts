import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { SetRatingUseCase } from '../use-cases/set-rating.use-case';
import { GetListingRatingUseCase } from '../use-cases/get-listing-rating.use-case';
import { GetMyRatingForListingUseCase } from '../use-cases/get-my-rating-for-listing.use-case';
import { ListListingRatingsUseCase } from '../use-cases/list-listing-ratings.use-case';
import { CreateRatingRequestDto } from '../dto/request/create-rating.dto';
import { RatingResponseDto } from '../dto/response/rating-response.dto';
import { ListingRatingSummaryResponseDto } from '../dto/response/listing-rating-summary-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('listings/:listingId/ratings')
export class RatingController {
  constructor(
    private readonly setRatingUseCase: SetRatingUseCase,
    private readonly getListingRatingUseCase: GetListingRatingUseCase,
    private readonly getMyRatingForListingUseCase: GetMyRatingForListingUseCase,
    private readonly listListingRatingsUseCase: ListListingRatingsUseCase,
  ) {}

  @Public()
  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getSummary(
    @Param('listingId') listingId: string,
  ): Promise<ListingRatingSummaryResponseDto> {
    const result = await this.getListingRatingUseCase.execute(listingId);
    return new ListingRatingSummaryResponseDto(result.avg, result.count);
  }

  @RequirePermissions(PERMISSIONS.RATINGS_CREATE)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyRating(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
  ): Promise<{ score: number } | null> {
    const rating = await this.getMyRatingForListingUseCase.execute(listingId, user.id);
    return rating ? { score: rating.score } : null;
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('listingId') listingId: string,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<RatingResponseDto>> {
    const result = await this.listListingRatingsUseCase.execute(listingId, query);
    return new PaginationResponse(
      result.data.map((r) => new RatingResponseDto(r)),
      result.meta,
    );
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
