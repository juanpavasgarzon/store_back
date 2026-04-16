import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { type UploadFileInput } from '../../../shared/files';
import { Listing } from '../entities/listing.entity';
import { ListingPhoto } from '../entities/listing-photo.entity';
import { ALLOWED_PHOTO_MIMETYPES, MAX_PHOTO_SIZE_BYTES } from '../constants/photo-upload.constants';
import { STORAGE_SERVICE, type IStorageService } from '../interfaces/storage-service.interface';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';

const MAX_WIDTH = 1200;
const THUMB_WIDTH = 400;
const WEBP_QUALITY = 80;

@Injectable()
export class UploadListingPhotosUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingPhoto)
    private readonly listingPhotoRepository: Repository<ListingPhoto>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute(listingId: string, user: IUser, files: UploadFileInput[]): Promise<ListingPhoto[]> {
    if (files.length === 0) {
      throw new BadRequestException('At least one photo is required');
    }

    for (const file of files) {
      const isAllowedMimetype = (ALLOWED_PHOTO_MIMETYPES as readonly string[]).includes(
        file.mimetype,
      );
      if (!isAllowedMimetype) {
        throw new BadRequestException(
          `File type "${file.mimetype}" is not allowed. Allowed types: ${ALLOWED_PHOTO_MIMETYPES.join(', ')}`,
        );
      }
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        throw new BadRequestException(
          `File size exceeds the maximum allowed size of ${MAX_PHOTO_SIZE_BYTES / (1024 * 1024)}MB`,
        );
      }
    }

    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (!hasPermission(user, PERMISSIONS.LISTINGS_MANAGE_ANY) && listing.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to upload photos to this listing');
    }

    const created: ListingPhoto[] = [];
    const savedPaths: string[] = [];

    try {
      for (const file of files) {
        const id = randomUUID();
        const filename = `${id}.webp`;
        const thumbFilename = `${id}_thumb.webp`;
        const originalExt = file.mimetype.split('/')[1] ?? 'bin';
        const originalFilename = `${id}_original.${originalExt}`;

        const originalPath = join('listings', listingId, originalFilename);
        await this.storageService.saveFile(originalPath, file.buffer);
        savedPaths.push(originalPath);

        const processedBuffer = await sharp(file.buffer)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .withMetadata()
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        const thumbBuffer = await sharp(file.buffer)
          .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
          .withMetadata()
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        const photoPath = join('listings', listingId, filename);
        const thumbPath = join('listings', listingId, thumbFilename);

        await this.storageService.saveFile(photoPath, processedBuffer);
        savedPaths.push(photoPath);
        await this.storageService.saveFile(thumbPath, thumbBuffer);
        savedPaths.push(thumbPath);

        const photoEntity = this.listingPhotoRepository.create({
          listingId,
          filename,
          originalFilename,
          url: this.storageService.resolvePublicUrl(photoPath),
          thumbnailUrl: this.storageService.resolvePublicUrl(thumbPath),
        });
        const saved = await this.listingPhotoRepository.save(photoEntity);
        created.push(saved);
      }
    } catch (error) {
      if (created.length > 0) {
        await this.listingPhotoRepository.remove(created);
      }
      for (const filePath of savedPaths) {
        await this.storageService.deleteFile(filePath);
      }
      throw error;
    }

    return created;
  }
}
