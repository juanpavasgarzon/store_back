import { Controller, Get, Patch, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { GetProfileUseCase } from '../use-cases/get-profile.use-case';
import { MeProfileResponseDto } from '../dto/response/me-profile-response.dto';
import { FavoriteService } from '../../listings/services/favorite.service';
import { ContactRequestService } from '../../listings/services/contact-request.service';
import { ListingService } from '../../listings/services/listing.service';
import { UpdateProfileUseCase } from '../use-cases/update-profile.use-case';
import { ChangePasswordUseCase } from '../use-cases/change-password.use-case';
import { UpdateProfileRequestDto } from '../dto/request/update-profile.dto';
import { ChangePasswordRequestDto } from '../dto/request/change-password.dto';
import { FavoriteResponseDto } from '../../listings/dto/response/favorite-response.dto';
import { ContactRequestResponseDto } from '../../listings/dto/response/contact-request-response.dto';
import { ListingResponseDto } from '../../listings/dto/response/listing-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('users/me')
export class MeController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly favoriteService: FavoriteService,
    private readonly contactRequestService: ContactRequestService,
    private readonly listingService: ListingService,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() user: IUser): Promise<MeProfileResponseDto> {
    const result = await this.getProfileUseCase.execute(user);
    return new MeProfileResponseDto(result);
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  async listMyFavorites(
    @CurrentUser() user: IUser,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<FavoriteResponseDto>> {
    const result = await this.favoriteService.listMyFavorites(user, query);
    return new PaginationResponse(
      result.data.map((f) => new FavoriteResponseDto(f)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('contact-requests')
  @HttpCode(HttpStatus.OK)
  async listMyContactRequests(
    @CurrentUser() user: IUser,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ContactRequestResponseDto>> {
    const result = await this.contactRequestService.listMyContactRequests(user, query);
    return new PaginationResponse(
      result.data.map((r) => new ContactRequestResponseDto(r)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('received-contact-requests')
  @HttpCode(HttpStatus.OK)
  async listReceivedContactRequests(
    @CurrentUser() user: IUser,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ContactRequestResponseDto>> {
    const result = await this.contactRequestService.listReceivedContactRequests(user, query);
    return new PaginationResponse(
      result.data.map((r) => new ContactRequestResponseDto(r)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @CurrentUser() user: IUser,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<MeProfileResponseDto> {
    const updated = await this.updateProfileUseCase.execute(user, dto);
    return new MeProfileResponseDto(updated);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @CurrentUser() user: IUser,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<void> {
    await this.changePasswordUseCase.execute(user, dto);
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('listings')
  @HttpCode(HttpStatus.OK)
  async listMyListings(
    @CurrentUser() user: IUser,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ListingResponseDto>> {
    const result = await this.listingService.listMyListings(user, query);
    return new PaginationResponse(
      result.data.map((l) => new ListingResponseDto(l)),
      result.meta,
    );
  }
}
