import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { LegalDocument } from '../entities/legal-document.entity';
import type { UpsertLegalDocumentRequestDto } from '../dto/request/upsert-legal-document.dto';

@Injectable()
export class UpsertLegalDocumentUseCase {
  constructor(
    @InjectRepository(LegalDocument)
    private readonly legalDocumentRepository: Repository<LegalDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(dto: UpsertLegalDocumentRequestDto): Promise<LegalDocument> {
    const existing = await this.legalDocumentRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      existing.title = dto.title;
      existing.content = dto.content;
      const updated = await this.legalDocumentRepository.save(existing);
      await this.cacheManager.clear();
      return updated;
    }

    const legalDocument = this.legalDocumentRepository.create({
      slug: dto.slug,
      title: dto.title,
      content: dto.content,
    });
    const created = await this.legalDocumentRepository.save(legalDocument);
    await this.cacheManager.clear();
    return created;
  }
}
