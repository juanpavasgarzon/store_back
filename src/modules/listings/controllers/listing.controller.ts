import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import type { Request } from 'express';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateListingUseCase } from '../use-cases/create-listing.use-case';
import { UpdateListingUseCase } from '../use-cases/update-listing.use-case';
import { DeleteListingUseCase } from '../use-cases/delete-listing.use-case';
import { ListListingsUseCase } from '../use-cases/list-listings.use-case';
import { GetListingUseCase } from '../use-cases/get-listing.use-case';
import { GetListingByCodeUseCase } from '../use-cases/get-listing-by-code.use-case';
import { RegisterListingViewUseCase } from '../use-cases/register-listing-view.use-case';
import { GetListingStatsUseCase } from '../use-cases/get-listing-stats.use-case';
import { ExportListingsCsvUseCase } from '../use-cases/export-listings-csv.use-case';
import { CountListingsUseCase } from '../use-cases/count-listings.use-case';
import {
  ListTrendingListingsUseCase,
  type TrendingPeriod,
} from '../use-cases/list-trending-listings.use-case';
import { CreateListingRequestDto } from '../dto/request/create-listing.dto';
import { UpdateListingRequestDto } from '../dto/request/update-listing.dto';
import { ListingResponseDto } from '../dto/response/listing-response.dto';
import { ListingStatsResponseDto } from '../dto/response/listing-stats-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('listings')
export class ListingController {
  private readonly logger = new Logger(ListingController.name);

  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
    private readonly listListingsUseCase: ListListingsUseCase,
    private readonly getListingUseCase: GetListingUseCase,
    private readonly getListingByCodeUseCase: GetListingByCodeUseCase,
    private readonly registerListingViewUseCase: RegisterListingViewUseCase,
    private readonly getListingStatsUseCase: GetListingStatsUseCase,
    private readonly exportListingsCsvUseCase: ExportListingsCsvUseCase,
    private readonly listTrendingListingsUseCase: ListTrendingListingsUseCase,
    private readonly countListingsUseCase: CountListingsUseCase,
  ) {}

  @Public()
  @Get('count')
  @HttpCode(HttpStatus.OK)
  async count(): Promise<{ count: number }> {
    const count = await this.countListingsUseCase.execute();
    return { count };
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_EXPORT)
  @Get('export/csv')
  @HttpCode(HttpStatus.OK)
  async exportCsv(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.exportListingsCsvUseCase.execute(query);
    const filename = `listings-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  async list(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
    @Query('minPrice') rawMinPrice?: string,
    @Query('maxPrice') rawMaxPrice?: string,
  ): Promise<PaginationResponse<ListingResponseDto>> {
    const minPrice = rawMinPrice != null && rawMinPrice !== '' ? Number(rawMinPrice) : undefined;
    const maxPrice = rawMaxPrice != null && rawMaxPrice !== '' ? Number(rawMaxPrice) : undefined;
    const result = await this.listListingsUseCase.execute(query, { minPrice, maxPrice });
    return new PaginationResponse(
      result.data.map((listing) => new ListingResponseDto(listing)),
      result.meta,
    );
  }

  @Public()
  @Get('trending')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  async listTrending(
    @Query('period') period: string,
    @Query('limit') limit: string,
  ): Promise<ListingResponseDto[]> {
    const safePeriod: TrendingPeriod = period === '24h' ? '24h' : '7d';
    const parsedLimit = parseInt(limit, 10);
    const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;
    const listings = await this.listTrendingListingsUseCase.execute(safePeriod, safeLimit);
    return listings.map((l) => new ListingResponseDto(l));
  }

  @Public()
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getByCode(
    @Param('code') code: string,
    @Req() req: Request,
    @CurrentUser() user: IUser | undefined,
  ): Promise<ListingResponseDto> {
    const { listing, context } = await this.getListingByCodeUseCase.execute(code, user?.id ?? null);
    this.registerListingViewUseCase
      .execute(listing.id, user?.id ?? null, req.ip ?? null)
      .catch((error: unknown) => this.logger.error('Failed to register listing view', error));
    return new ListingResponseDto(listing, context);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUser() user: IUser | undefined,
  ): Promise<ListingResponseDto> {
    const { listing, context } = await this.getListingUseCase.execute(id, user?.id ?? null);
    this.registerListingViewUseCase
      .execute(listing.id, user?.id ?? null, req.ip ?? null)
      .catch((error: unknown) => this.logger.error('Failed to register listing view', error));
    return new ListingResponseDto(listing, context);
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_STATS_READ)
  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  async getStats(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<ListingStatsResponseDto> {
    return this.getListingStatsUseCase.execute(id, user);
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: IUser,
    @Body() request: CreateListingRequestDto,
  ): Promise<ListingResponseDto> {
    const listing = await this.createListingUseCase.execute(user, request);
    return new ListingResponseDto(listing);
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_UPDATE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: IUser,
    @Param('id') id: string,
    @Body() request: UpdateListingRequestDto,
  ): Promise<ListingResponseDto> {
    const listing = await this.updateListingUseCase.execute(id, user, request);
    return new ListingResponseDto(listing);
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: IUser, @Param('id') id: string): Promise<void> {
    await this.deleteListingUseCase.execute(id, user);
  }
}
