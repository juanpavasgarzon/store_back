import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingReport } from '../entities/listing-report.entity';
import type { ReportStatus } from '../constants/report-status.constants';

@Injectable()
export class UpdateListingReportStatusUseCase {
  constructor(
    @InjectRepository(ListingReport)
    private readonly listingReportRepository: Repository<ListingReport>,
  ) {}

  async execute(reportId: string, status: ReportStatus): Promise<ListingReport> {
    const report = await this.listingReportRepository.findOne({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.status = status;
    return this.listingReportRepository.save(report);
  }
}
