import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactConfig } from '../entities/contact-config.entity';

@Injectable()
export class SaveContactConfigUseCase {
  constructor(
    @InjectRepository(ContactConfig)
    private readonly contactConfigRepository: Repository<ContactConfig>,
  ) {}

  async execute(data: {
    recipientEmail: string;
    subjectTemplate?: string | null;
    messageTemplate?: string | null;
  }): Promise<ContactConfig> {
    const existing = await this.contactConfigRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });
    if (existing) {
      existing.recipientEmail = data.recipientEmail;
      existing.subjectTemplate = data.subjectTemplate ?? null;
      existing.messageTemplate = data.messageTemplate ?? null;
      return this.contactConfigRepository.save(existing);
    }
    const config = this.contactConfigRepository.create(data);
    return this.contactConfigRepository.save(config);
  }
}
