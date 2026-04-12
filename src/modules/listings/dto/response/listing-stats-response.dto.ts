export class ListingStatsResponseDto {
  listingId: string;
  totalViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  uniqueViewers: number;
  favoritesCount: number;
  averageRating: number;
  ratingsCount: number;
  contactRequestsCount: number;

  constructor(data: ListingStatsResponseDto) {
    this.listingId = data.listingId;
    this.totalViews = data.totalViews;
    this.viewsLast7Days = data.viewsLast7Days;
    this.viewsLast30Days = data.viewsLast30Days;
    this.uniqueViewers = data.uniqueViewers;
    this.favoritesCount = data.favoritesCount;
    this.averageRating = data.averageRating;
    this.ratingsCount = data.ratingsCount;
    this.contactRequestsCount = data.contactRequestsCount;
  }
}
