import { Controller, Post, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/constants';
import type { IUser } from '../../../shared';
import { AddFavoriteUseCase } from '../use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../use-cases/remove-favorite.use-case';
import { FavoriteResponseDto } from '../dto/response/favorite-response.dto';

@Controller('listings/:listingId/favorites')
export class FavoriteController {
  constructor(
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.FAVORITES_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
  ): Promise<FavoriteResponseDto> {
    const favorite = await this.addFavoriteUseCase.execute(listingId, user);
    return new FavoriteResponseDto(favorite);
  }

  @RequirePermissions(PERMISSIONS.FAVORITES_DELETE)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('listingId') listingId: string, @CurrentUser() user: IUser): Promise<void> {
    await this.removeFavoriteUseCase.execute(listingId, user);
  }
}
