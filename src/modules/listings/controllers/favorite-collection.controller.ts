import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateFavoriteCollectionUseCase } from '../use-cases/create-favorite-collection.use-case';
import { ListFavoriteCollectionsUseCase } from '../use-cases/list-favorite-collections.use-case';
import { DeleteFavoriteCollectionUseCase } from '../use-cases/delete-favorite-collection.use-case';
import { AssignFavoriteCollectionUseCase } from '../use-cases/assign-favorite-collection.use-case';
import { CreateFavoriteCollectionRequestDto } from '../dto/request/create-favorite-collection.dto';
import { AssignFavoriteCollectionRequestDto } from '../dto/request/assign-favorite-collection.dto';
import { FavoriteCollectionResponseDto } from '../dto/response/favorite-collection-response.dto';

@Controller('favorites/collections')
export class FavoriteCollectionController {
  constructor(
    private readonly createFavoriteCollectionUseCase: CreateFavoriteCollectionUseCase,
    private readonly listFavoriteCollectionsUseCase: ListFavoriteCollectionsUseCase,
    private readonly deleteFavoriteCollectionUseCase: DeleteFavoriteCollectionUseCase,
    private readonly assignFavoriteCollectionUseCase: AssignFavoriteCollectionUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.FAVORITES_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: IUser,
    @Body() dto: CreateFavoriteCollectionRequestDto,
  ): Promise<FavoriteCollectionResponseDto> {
    const collection = await this.createFavoriteCollectionUseCase.execute(user, dto);
    return new FavoriteCollectionResponseDto(collection);
  }

  @RequirePermissions(PERMISSIONS.FAVORITES_CREATE)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@CurrentUser() user: IUser): Promise<FavoriteCollectionResponseDto[]> {
    const collections = await this.listFavoriteCollectionsUseCase.execute(user);
    return collections.map((c) => new FavoriteCollectionResponseDto(c));
  }

  @RequirePermissions(PERMISSIONS.FAVORITES_DELETE)
  @Delete(':collectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('collectionId') collectionId: string,
    @CurrentUser() user: IUser,
  ): Promise<void> {
    await this.deleteFavoriteCollectionUseCase.execute(collectionId, user);
  }

  @RequirePermissions(PERMISSIONS.FAVORITES_CREATE)
  @Patch(':listingId/collection')
  @HttpCode(HttpStatus.NO_CONTENT)
  async assign(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() dto: AssignFavoriteCollectionRequestDto,
  ): Promise<void> {
    await this.assignFavoriteCollectionUseCase.execute(listingId, user, dto.collectionId);
  }
}
