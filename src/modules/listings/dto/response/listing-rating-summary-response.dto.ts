export class ListingRatingSummaryResponseDto {
  avg: number;
  count: number;

  constructor(avg: number, count: number) {
    this.avg = avg;
    this.count = count;
  }
}
