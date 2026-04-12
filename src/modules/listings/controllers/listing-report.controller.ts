import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateListingReportUseCase } from '../use-cases/create-listing-report.use-case';
import { ListListingReportsUseCase } from '../use-cases/list-listing-reports.use-case';
import { UpdateListingReportStatusUseCase } from '../use-cases/update-listing-report-status.use-case';
import { CreateListingReportRequestDto } from '../dto/request/create-listing-report.dto';
import { UpdateListingReportStatusRequestDto } from '../dto/request/update-listing-report-status.dto';
import { ListingReportResponseDto } from '../dto/response/listing-report-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller()
export class ListingReportController {
  constructor(
    private readonly createListingReportUseCase: CreateListingReportUseCase,
    private readonly listListingReportsUseCase: ListListingReportsUseCase,
    private readonly updateListingReportStatusUseCase: UpdateListingReportStatusUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.LISTINGS_REPORTS_CREATE)
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('listings/:listingId/reports')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() dto: CreateListingReportRequestDto,
  ): Promise<ListingReportResponseDto> {
    const report = await this.createListingReportUseCase.execute(listingId, user, dto);
    return new ListingReportResponseDto(report);
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_REPORTS_READ)
  @Get('reports')
  @HttpCode(HttpStatus.OK)
  async listAll(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<ListingReportResponseDto>> {
    const result = await this.listListingReportsUseCase.execute(query);
    return new PaginationResponse(
      result.data.map((r) => new ListingReportResponseDto(r)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.LISTINGS_REPORTS_UPDATE)
  @Patch('reports/:reportId/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('reportId') reportId: string,
    @Body() dto: UpdateListingReportStatusRequestDto,
  ): Promise<ListingReportResponseDto> {
    const report = await this.updateListingReportStatusUseCase.execute(reportId, dto.status);
    return new ListingReportResponseDto(report);
  }
}
