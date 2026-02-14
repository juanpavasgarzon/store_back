import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { extensionFromMimetype, type UploadFileInput } from '../../../shared/files';
import { Listing } from '../entities/listing.entity';
import { ListingPhoto } from '../entities/listing-photo.entity';

const DEFAULT_UPLOADS_DIR = join(process.cwd(), 'uploads');

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
    const apiPrefix = this.configService.get<string>('app.apiPrefix', 'api');
    const listingDir = join(uploadsDir, 'listings', listingId);
    await mkdir(listingDir, { recursive: true });

    const baseUrlPath = `/${apiPrefix}/listings/${listingId}/photos`;
    const created: ListingPhoto[] = [];

    for (const file of files) {
      const ext = extensionFromMimetype(file.mimetype);
      const filename = `${randomUUID()}.${ext}`;
      const filePath = join(listingDir, filename);
      await writeFile(filePath, file.buffer);

      const url = `${baseUrlPath}/${filename}`;
      const photoEntity = this.listingPhotoRepository.create({
        listingId,
        filename,
        url,
      });
      const saved = await this.listingPhotoRepository.save(photoEntity);
      created.push(saved);
    }

    return created;
  }
}
