import type { LegalDocument } from '../../entities/legal-document.entity';

export class LegalDocumentResponseDto {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(doc: LegalDocument) {
    this.id = doc.id;
    this.slug = doc.slug;
    this.title = doc.title;
    this.content = doc.content;
    this.createdAt = doc.createdAt;
    this.updatedAt = doc.updatedAt;
  }
}
