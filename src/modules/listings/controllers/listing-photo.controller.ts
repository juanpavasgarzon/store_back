import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  StreamableFile,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { memoryStorage } from 'multer';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { UploadListingPhotosUseCase } from '../use-cases/upload-listing-photos.use-case';
import { ListListingPhotosUseCase } from '../use-cases/list-listing-photos.use-case';
import { GetListingPhotoFileUseCase } from '../use-cases/get-listing-photo-file.use-case';
import { ListingPhotoResponseDto } from '../dto/response/listing-photo-response.dto';

@Controller('listings/:listingId/photos')
export class ListingPhotoController {
  constructor(
    private readonly uploadListingPhotosUseCase: UploadListingPhotosUseCase,
    private readonly listListingPhotosUseCase: ListListingPhotosUseCase,
    private readonly getListingPhotoFileUseCase: GetListingPhotoFileUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.LISTINGS_UPDATE)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ListingPhotoResponseDto[]> {
    const inputs = (files ?? []).map((f) => ({
      buffer: f.buffer,
      mimetype: f.mimetype,
      size: f.size,
    }));
    const photos = await this.uploadListingPhotosUseCase.execute(listingId, user, inputs);
    return photos.map((p) => new ListingPhotoResponseDto(p));
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Param('listingId') listingId: string): Promise<ListingPhotoResponseDto[]> {
    const photos = await this.listListingPhotosUseCase.execute(listingId);
    return photos.map((p) => new ListingPhotoResponseDto(p));
  }

  @Public()
  @Get(':filename')
  async getFile(
    @Param('listingId') listingId: string,
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const { stream, contentType } = await this.getListingPhotoFileUseCase.execute(
      listingId,
      filename,
    );
    return new StreamableFile(stream, { type: contentType });
  }
}
