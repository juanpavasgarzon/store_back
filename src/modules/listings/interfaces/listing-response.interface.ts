export interface ListingPhotoResponse {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string | null;
}

export interface ListingCategoryResponse {
  id: string | null;
  name: string | null;
  slug: string | null;
}

export interface ListingSellerResponse {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
}

export interface ListingAttributeValueResponse {
  id: string;
  attributeId: string;
  attributeName: string;
  attributeKey: string;
  valueType: string;
  value: string;
}

export interface ListingResponseShape {
  id: string;
  code: string;
  userId: string;
  categoryId: string;
  category?: ListingCategoryResponse;
  seller?: ListingSellerResponse;
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
  photos?: ListingPhotoResponse[];
  attributeValues?: ListingAttributeValueResponse[];
}

export interface ListingUserContext {
  isFavorited: boolean;
}
