import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { join } from 'path';
import { ListingPhoto } from '../entities/listing-photo.entity';
import { STORAGE_SERVICE, type IStorageService } from '../interfaces/storage-service.interface';
import type { GetListingPhotoFileResult } from '../interfaces/get-listing-photo-file-result.interface';

const SAFE_FILENAME_REGEX = /^[a-f0-9_-]+\.(jpg|jpeg|png|gif|webp)$/i;

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
};

@Injectable()
export class GetListingPhotoFileUseCase {
  constructor(
    @InjectRepository(ListingPhoto)
    private readonly listingPhotoRepository: Repository<ListingPhoto>,
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async execute(listingId: string, filename: string): Promise<GetListingPhotoFileResult> {
    if (!SAFE_FILENAME_REGEX.test(filename)) {
      throw new NotFoundException('Photo not found');
    }

    // A listing photo row stores only the main filename (e.g. abc.webp).
    // The thumbnail (abc_thumb.webp) is derived from it and must also be serveable.
    // Accept either the exact filename OR any photo whose thumbnailUrl ends with /filename.
    const photo = await this.listingPhotoRepository.findOne({
      where: [
        { listingId, filename },
        { listingId, thumbnailUrl: Like(`%/${filename}`) },
      ],
    });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const relativePath = join('listings', listingId, filename);
    if (!(await this.storageService.fileExists(relativePath))) {
      throw new NotFoundException('Photo not found');
    }

    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = EXT_TO_CONTENT_TYPE[ext] ?? 'application/octet-stream';

    return {
      stream: await this.storageService.readFile(relativePath),
      contentType,
    };
  }
}
