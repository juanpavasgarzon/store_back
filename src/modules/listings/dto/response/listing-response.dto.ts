import type { Listing } from '../../entities/listing.entity';
import type { ListingResponseShape } from '../../interfaces/listing-response.interface';

export class ListingResponseDto implements ListingResponseShape {
  id: string;
  code: string;
  categoryId: string;
  category?: ListingResponseShape['category'];
  title: string;
  description: string;
  price: string;
  location: string;
  sector: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  photos?: ListingResponseShape['photos'];
  variants?: ListingResponseShape['variants'];

  constructor(listing: Listing) {
    this.id = listing.id;
    this.code = listing.code;
    this.categoryId = listing.categoryId;
    this.category = {
      id: listing.category?.id ?? null,
      name: listing.category?.name ?? null,
      slug: listing.category?.slug ?? null,
    };
    this.title = listing.title;
    this.description = listing.description;
    this.price = listing.price;
    this.location = listing.location;
    this.sector = listing.sector ?? null;
    this.latitude = listing.latitude ?? null;
    this.longitude = listing.longitude ?? null;
    this.isActive = listing.isActive ?? true;
    this.createdAt = listing.createdAt;
    this.updatedAt = listing.updatedAt;
    this.photos = listing.photos?.map((p) => ({
      id: p.id,
      filename: p.filename,
      url: p.url,
    }));
    this.variants = listing.variants?.map((lv) => ({
      id: lv.id,
      categoryVariantId: lv.categoryVariantId,
      categoryVariantKey: lv.categoryVariant?.key,
      value: lv.value,
    }));
  }
}
