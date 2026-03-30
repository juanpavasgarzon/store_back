import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocument } from '../entities/legal-document.entity';
import type { UpsertLegalDocumentRequestDto } from '../dto/request/upsert-legal-document.dto';

@Injectable()
export class UpsertLegalDocumentUseCase {
  constructor(
    @InjectRepository(LegalDocument)
    private readonly legalDocumentRepository: Repository<LegalDocument>,
  ) {}

  async execute(dto: UpsertLegalDocumentRequestDto): Promise<LegalDocument> {
    const existing = await this.legalDocumentRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      existing.title = dto.title;
      existing.content = dto.content;
      return this.legalDocumentRepository.save(existing);
    }

    const legalDocument = this.legalDocumentRepository.create({
      slug: dto.slug,
      title: dto.title,
      content: dto.content,
    });
    return this.legalDocumentRepository.save(legalDocument);
  }
}
