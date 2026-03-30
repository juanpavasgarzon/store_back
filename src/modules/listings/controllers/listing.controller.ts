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
} from '@nestjs/common';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateListingUseCase } from '../use-cases/create-listing.use-case';
import { UpdateListingUseCase } from '../use-cases/update-listing.use-case';
import { DeleteListingUseCase } from '../use-cases/delete-listing.use-case';
import { ListListingsUseCase } from '../use-cases/list-listings.use-case';
import { ListNearbyListingsUseCase } from '../use-cases/list-nearby-listings.use-case';
import { GetListingUseCase } from '../use-cases/get-listing.use-case';
import { GetListingByCodeUseCase } from '../use-cases/get-listing-by-code.use-case';
import { CreateListingRequestDto } from '../dto/request/create-listing.dto';
import { UpdateListingRequestDto } from '../dto/request/update-listing.dto';
import { ListingResponseDto } from '../dto/response/listing-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('listings')
export class ListingController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,
    private readonly updateListingUseCase: UpdateListingUseCase,
    private readonly deleteListingUseCase: DeleteListingUseCase,
    private readonly listListingsUseCase: ListListingsUseCase,
    private readonly listNearbyListingsUseCase: ListNearbyListingsUseCase,
    private readonly getListingUseCase: GetListingUseCase,
    private readonly getListingByCodeUseCase: GetListingByCodeUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ListingResponseDto>> {
    const result = await this.listListingsUseCase.execute(query);
    return new PaginationResponse(
      result.data.map((listing) => new ListingResponseDto(listing)),
      result.meta,
    );
  }

  @Public()
  @Get('nearby')
  @HttpCode(HttpStatus.OK)
  async listNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ListingResponseDto>> {
    const result = await this.listNearbyListingsUseCase.execute(
      parseFloat(lat),
      parseFloat(lng),
      radius != null ? parseFloat(radius) : undefined,
      query,
    );
    return new PaginationResponse(
      result.data.map((listing) => new ListingResponseDto(listing)),
      result.meta,
    );
  }

  @Public()
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async getByCode(@Param('code') code: string): Promise<ListingResponseDto> {
    const listing = await this.getListingByCodeUseCase.execute(code);
    return new ListingResponseDto(listing);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<ListingResponseDto> {
    const listing = await this.getListingUseCase.execute(id);
    return new ListingResponseDto(listing);
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
