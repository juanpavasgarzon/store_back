import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { resolve } from 'path';
import type { ReadStream } from 'fs';
import { ListingPhoto } from '../entities/listing-photo.entity';

const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');
const SAFE_FILENAME_REGEX = /^[a-f0-9-]+\.(jpg|jpeg|png|gif|webp)$/i;

const EXT_TO_CONTENT_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
};

export interface GetListingPhotoFileResult {
  stream: ReadStream;
  contentType: string;
}

@Injectable()
export class GetListingPhotoFileUseCase {
  constructor(
    @InjectRepository(ListingPhoto)
    private readonly listingPhotoRepository: Repository<ListingPhoto>,
    private readonly configService: ConfigService,
  ) {}

  async execute(listingId: string, filename: string): Promise<GetListingPhotoFileResult> {
    if (!SAFE_FILENAME_REGEX.test(filename)) {
      throw new NotFoundException('Photo not found');
    }

    const photo = await this.listingPhotoRepository.findOne({
      where: { listingId, filename },
    });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const uploadsDir = this.configService.get<string>('uploads.dir') ?? DEFAULT_UPLOADS_DIR;
    const filePath = join(uploadsDir, 'listings', listingId, filename);
    const resolvedPath = resolve(filePath);
    const resolvedUploadsDir = resolve(uploadsDir);
    if (!resolvedPath.startsWith(resolvedUploadsDir) || !existsSync(resolvedPath)) {
      throw new NotFoundException('Photo not found');
    }

    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const contentType = EXT_TO_CONTENT_TYPE[ext] ?? 'application/octet-stream';

    return {
      stream: createReadStream(resolvedPath),
      contentType,
    };
  }
}
