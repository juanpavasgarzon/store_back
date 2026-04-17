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
  seller?: ListingResponseShape['seller'];
  title: string;
  description: string;
  price: number;
  location: string;
  city: string | null;
  sector: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  expiresAt: Date | null;
  isActive: boolean;
  isBoosted: boolean;
  boostedUntil: Date | null;
  isFavorited: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  photos?: ListingResponseShape['photos'];
  attributeValues?: ListingResponseShape['attributeValues'];

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
    if (listing.user) {
      this.seller = {
        id: listing.user.id,
        name: listing.user.name,
        phone: listing.user.phone ?? null,
        city: listing.user.city ?? null,
      };
    }
    this.title = listing.title;
    this.description = listing.description;
    this.price = parseFloat(listing.price);
    this.location = listing.location;
    this.city = listing.city ?? null;
    this.sector = listing.sector ?? null;
    this.latitude = listing.latitude != null ? parseFloat(listing.latitude) : null;
    this.longitude = listing.longitude != null ? parseFloat(listing.longitude) : null;
    this.status = listing.deletedAt ? 'deleted' : listing.status;
    this.expiresAt = listing.expiresAt ?? null;
    this.isActive = listing.isActive ?? true;
    this.isBoosted = listing.isBoosted ?? false;
    this.boostedUntil = listing.boostedUntil ?? null;
    this.isFavorited = context?.isFavorited ?? null;
    this.createdAt = listing.createdAt;
    this.updatedAt = listing.updatedAt;
    this.photos = listing.photos?.map((photo) => ({
      id: photo.id,
      filename: photo.filename,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl ?? null,
    }));
    this.attributeValues = listing.attributeValues?.map((attributeValue) => ({
      id: attributeValue.id,
      attributeId: attributeValue.attributeId,
      attributeName: attributeValue.attribute?.name ?? '',
      attributeKey: attributeValue.attribute?.key ?? '',
      valueType: attributeValue.attribute?.valueType ?? 'text',
      value: attributeValue.value,
    }));
  }
}
