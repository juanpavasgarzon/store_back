import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { REPORT_REASON, type ReportReason } from '../../constants/report-reason.constants';

export class CreateListingReportRequestDto {
  @IsEnum(REPORT_REASON)
  reason!: ReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}
