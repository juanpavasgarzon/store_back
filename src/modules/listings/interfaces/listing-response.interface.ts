export interface ListingPhotoResponse {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string | null;
}

export interface ListingVariantValueResponse {
  id: string;
  categoryVariantId: string;
  categoryVariantKey?: string;
  value: string;
}

export interface ListingCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ListingResponseShape {
  id: string;
  code: string;
  userId: string;
  categoryId: string;
  category?: ListingCategoryResponse;
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
  createdAt: Date;
  updatedAt: Date;
  photos?: ListingPhotoResponse[];
  variants?: ListingVariantValueResponse[];
}
