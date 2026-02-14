import { Injectable } from '@nestjs/common';
import type { ContactConfig } from '../entities/contact-config.entity';
import { FindContactConfigUseCase } from '../use-cases/find-contact-config.use-case';

@Injectable()
export class ContactConfigService {
  constructor(private readonly findContactConfigUseCase: FindContactConfigUseCase) {}

  getConfig(): Promise<ContactConfig | null> {
    return this.findContactConfigUseCase.execute();
  }
}
