import type { ContactConfig } from '../../entities/contact-config.entity';

export class ContactConfigResponseDto {
  id: string;
  recipientEmail: string;
  subjectTemplate: string | null;
  messageTemplate: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(config: ContactConfig) {
    this.id = config.id;
    this.recipientEmail = config.recipientEmail;
    this.subjectTemplate = config.subjectTemplate ?? null;
    this.messageTemplate = config.messageTemplate ?? null;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }
}
