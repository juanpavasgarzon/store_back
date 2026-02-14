import type { ListingPhoto } from '../../entities/listing-photo.entity';

export class ListingPhotoResponseDto {
  id: string;
  filename: string;
  url: string;

  constructor(photo: ListingPhoto) {
    this.id = photo.id;
    this.filename = photo.filename;
    this.url = photo.url;
  }
}
