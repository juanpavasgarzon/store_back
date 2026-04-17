import type { ListingReport } from '../../entities/listing-report.entity';
import type { ReportReason } from '../../constants/report-reason.constants';
import type { ReportStatus } from '../../constants/report-status.constants';

export class ListingReportResponseDto {
  id: string;
  userId: string;
  listingId: string;
  listing: { id: string; title: string } | null;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(report: ListingReport) {
    this.id = report.id;
    this.userId = report.userId;
    this.listingId = report.listingId;
    this.listing = report.listing
      ? { id: report.listing.id, title: report.listing.title }
      : null;
    this.reason = report.reason;
    this.details = report.details;
    this.status = report.status;
    this.createdAt = report.createdAt;
    this.updatedAt = report.updatedAt;
  }
}
