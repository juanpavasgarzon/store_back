import { Controller, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../../../shared';
import { ListListingsByCategoryUseCase } from '../use-cases/list-listings-by-category.use-case';
import { ListingResponseDto } from '../dto/response/listing-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('categories/:categoryId/listings')
export class ListingByCategoryController {
  constructor(private readonly listListingsByCategoryUseCase: ListListingsByCategoryUseCase) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('categoryId') categoryId: string,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ListingResponseDto>> {
    const result = await this.listListingsByCategoryUseCase.execute(categoryId, query);
    return new PaginationResponse(
      result.data.map((l) => new ListingResponseDto(l)),
      result.meta,
    );
  }
}
