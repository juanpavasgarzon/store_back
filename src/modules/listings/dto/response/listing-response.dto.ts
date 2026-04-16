import type { Listing } from '../../entities/listing.entity';
import type {
  ListingResponseShape,
  ListingUserContext,
} from '../../interfaces/listing-response.interface';

export class ListingResponseDto implements ListingResponseShape {
  id: string;
  code: string;
  userId: string;
  categoryId: string;
  category?: ListingResponseShape['category'];
  title: string;
  description: string;
  price: number;
  location: string;
  sector: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  expiresAt: Date | null;
  isActive: boolean;
  isBoosted: boolean;
  boostedUntil: Date | null;
  isFavorited: boolean | null;
  myRating: number | null;
  createdAt: Date;
  updatedAt: Date;
  photos?: ListingResponseShape['photos'];
  variants?: ListingResponseShape['variants'];

  constructor(listing: Listing, context?: ListingUserContext) {
    this.id = listing.id;
    this.code = listing.code;
    this.userId = listing.userId;
    this.categoryId = listing.categoryId;
    this.category = {
      id: listing.category?.id ?? null,
      name: listing.category?.name ?? null,
      slug: listing.category?.slug ?? null,
    };
    this.title = listing.title;
    this.description = listing.description;
    this.price = parseFloat(listing.price);
    this.location = listing.location;
    this.sector = listing.sector ?? null;
    this.latitude = listing.latitude != null ? parseFloat(listing.latitude) : null;
    this.longitude = listing.longitude != null ? parseFloat(listing.longitude) : null;
    this.status = listing.status;
    this.expiresAt = listing.expiresAt ?? null;
    this.isActive = listing.isActive ?? true;
    this.isBoosted = listing.isBoosted ?? false;
    this.boostedUntil = listing.boostedUntil ?? null;
    this.isFavorited = context?.isFavorited ?? null;
    this.myRating = context?.myRating ?? null;
    this.createdAt = listing.createdAt;
    this.updatedAt = listing.updatedAt;
    this.photos = listing.photos?.map((p) => ({
      id: p.id,
      filename: p.filename,
      url: p.url,
      thumbnailUrl: p.thumbnailUrl ?? null,
    }));
    this.variants = listing.variants?.map((lv) => ({
      id: lv.id,
      categoryVariantId: lv.categoryVariantId,
      categoryVariantKey: lv.categoryVariant?.key,
      value: lv.value,
    }));
  }
}
