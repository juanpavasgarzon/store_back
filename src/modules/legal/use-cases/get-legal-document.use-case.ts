import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocument } from '../entities/legal-document.entity';

@Injectable()
export class GetLegalDocumentUseCase {
  constructor(
    @InjectRepository(LegalDocument)
    private readonly legalDocumentRepository: Repository<LegalDocument>,
  ) {}

  async execute(slug: string): Promise<LegalDocument> {
    const doc = await this.legalDocumentRepository.findOne({ where: { slug } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }
}
