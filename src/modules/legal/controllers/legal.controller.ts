import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/constants';
import type { IUser } from '../../../shared';
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
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<LegalDocumentResponseDto[]> {
    const list = await this.listLegalDocumentsUseCase.execute();
    return list.map((doc) => new LegalDocumentResponseDto(doc));
  }

  @Public()
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getBySlug(@Param('slug') slug: string): Promise<LegalDocumentResponseDto> {
    const doc = await this.getLegalDocumentUseCase.execute(slug);
    return new LegalDocumentResponseDto(doc);
  }

  @RequirePermissions(PERMISSIONS.LEGAL_UPDATE)
  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @CurrentUser() user: IUser,
    @Body() dto: UpsertLegalDocumentRequestDto,
  ): Promise<LegalDocumentResponseDto> {
    const doc = await this.upsertLegalDocumentUseCase.execute(user, dto);
    return new LegalDocumentResponseDto(doc);
  }
}
