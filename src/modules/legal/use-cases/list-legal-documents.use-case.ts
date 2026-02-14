import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalDocument } from '../entities/legal-document.entity';

@Injectable()
export class ListLegalDocumentsUseCase {
  constructor(
    @InjectRepository(LegalDocument)
    private readonly legalDocumentRepository: Repository<LegalDocument>,
  ) {}

  async execute(): Promise<LegalDocument[]> {
    return this.legalDocumentRepository.find({ order: { slug: 'ASC' } });
  }
}
