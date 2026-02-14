import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalDocument } from './entities/legal-document.entity';
import { LegalController } from './controllers/legal.controller';
import { GetLegalDocumentUseCase } from './use-cases/get-legal-document.use-case';
import { ListLegalDocumentsUseCase } from './use-cases/list-legal-documents.use-case';
import { UpsertLegalDocumentUseCase } from './use-cases/upsert-legal-document.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([LegalDocument])],
  controllers: [LegalController],
  providers: [GetLegalDocumentUseCase, ListLegalDocumentsUseCase, UpsertLegalDocumentUseCase],
})
export class LegalModule {}
