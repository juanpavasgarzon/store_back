import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { type UploadFileInput } from '../../../shared/files';
import { Listing } from '../entities/listing.entity';
import { ListingPhoto } from '../entities/listing-photo.entity';

const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');
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
    private readonly configService: ConfigService,
  ) {}

  async execute(listingId: string, files: UploadFileInput[]): Promise<ListingPhoto[]> {
    if (files.length === 0) {
      throw new BadRequestException('At least one photo is required');
    }

    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const uploadsDir = this.configService.get<string>('uploads.dir') ?? DEFAULT_UPLOADS_DIR;
    const listingDir = join(uploadsDir, 'listings', listingId);
    await mkdir(listingDir, { recursive: true });

    const baseUrlPath = `/listings/${listingId}/photos`;
    const created: ListingPhoto[] = [];

    for (const file of files) {
      const id = randomUUID();
      const filename = `${id}.webp`;
      const thumbFilename = `${id}_thumb.webp`;
      const originalExt = file.mimetype.split('/')[1] ?? 'bin';
      const originalFilename = `${id}_original.${originalExt}`;

      await writeFile(join(listingDir, originalFilename), file.buffer);

      const processedBuffer = await sharp(file.buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      const thumbBuffer = await sharp(file.buffer)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      await writeFile(join(listingDir, filename), processedBuffer);
      await writeFile(join(listingDir, thumbFilename), thumbBuffer);

      const photoEntity = this.listingPhotoRepository.create({
        listingId,
        filename,
        originalFilename,
        url: `${baseUrlPath}/${filename}`,
        thumbnailUrl: `${baseUrlPath}/${thumbFilename}`,
      });
      const saved = await this.listingPhotoRepository.save(photoEntity);
      created.push(saved);
    }

    return created;
  }
}
