import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import { GetLegalDocumentUseCase } from '../use-cases/get-legal-document.use-case';
import { ListLegalDocumentsUseCase } from '../use-cases/list-legal-documents.use-case';
import { UpsertLegalDocumentUseCase } from '../use-cases/upsert-legal-document.use-case';
import { UpsertLegalDocumentRequestDto } from '../dto/request/upsert-legal-document.dto';
import { LegalDocumentResponseDto } from '../dto/response/legal-document-response.dto';

@Controller('legal')
export class LegalController {
  constructor(
    private readonly getLegalDocumentUseCase: GetLegalDocumentUseCase,
    private readonly listLegalDocumentsUseCase: ListLegalDocumentsUseCase,
    private readonly upsertLegalDocumentUseCase: UpsertLegalDocumentUseCase,
  ) {}

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('legal_list')
  @CacheTTL(600000)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<LegalDocumentResponseDto[]> {
    const list = await this.listLegalDocumentsUseCase.execute();
    return list.map((doc) => new LegalDocumentResponseDto(doc));
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600000)
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getBySlug(@Param('slug') slug: string): Promise<LegalDocumentResponseDto> {
    const doc = await this.getLegalDocumentUseCase.execute(slug);
    return new LegalDocumentResponseDto(doc);
  }

  @RequirePermissions(PERMISSIONS.LEGAL_UPDATE)
  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(@Body() dto: UpsertLegalDocumentRequestDto): Promise<LegalDocumentResponseDto> {
    const doc = await this.upsertLegalDocumentUseCase.execute(dto);
    return new LegalDocumentResponseDto(doc);
  }
}
