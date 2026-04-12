import { Injectable } from '@nestjs/common';
import { FindContactConfigUseCase } from './find-contact-config.use-case';
import type { ContactConfig } from '../entities/contact-config.entity';

@Injectable()
export class GetContactConfigUseCase {
  constructor(private readonly findContactConfigUseCase: FindContactConfigUseCase) {}

  async execute(): Promise<ContactConfig | null> {
    return this.findContactConfigUseCase.execute();
  }
}
