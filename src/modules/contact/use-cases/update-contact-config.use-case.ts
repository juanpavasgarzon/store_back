import { Injectable } from '@nestjs/common';
import { SaveContactConfigUseCase } from './save-contact-config.use-case';
import type { UpdateContactConfigRequestDto } from '../dto/request/contact-config.dto';
import type { ContactConfig } from '../entities/contact-config.entity';

@Injectable()
export class UpdateContactConfigUseCase {
  constructor(private readonly saveContactConfigUseCase: SaveContactConfigUseCase) {}

  async execute(dto: UpdateContactConfigRequestDto): Promise<ContactConfig> {
    return this.saveContactConfigUseCase.execute({
      recipientEmail: dto.recipientEmail,
      subjectTemplate: dto.subjectTemplate,
      messageTemplate: dto.messageTemplate,
    });
  }
}
