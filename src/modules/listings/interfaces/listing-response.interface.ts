export interface ListingPhotoResponse {
  id: string;
  url: string;
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
  categoryId: string;
  category?: ListingCategoryResponse;
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
  photos?: ListingPhotoResponse[];
  variants?: ListingVariantValueResponse[];
}
