import { IsEnum } from 'class-validator';
import { REPORT_STATUS, type ReportStatus } from '../../constants/report-status.constants';

export class UpdateListingReportStatusRequestDto {
  @IsEnum(REPORT_STATUS)
  status!: ReportStatus;
}
