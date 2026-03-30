import type { ListingPhoto } from '../../entities/listing-photo.entity';

export class ListingPhotoResponseDto {
  id: string;
  filename: string;
  originalFilename: string | null;
  url: string;
  thumbnailUrl: string | null;

  constructor(photo: ListingPhoto) {
    this.id = photo.id;
    this.filename = photo.filename;
    this.originalFilename = photo.originalFilename ?? null;
    this.url = photo.url;
    this.thumbnailUrl = photo.thumbnailUrl ?? null;
  }
}
