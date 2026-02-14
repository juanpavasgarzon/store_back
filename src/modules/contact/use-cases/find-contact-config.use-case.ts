import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactConfig } from '../entities/contact-config.entity';

@Injectable()
export class FindContactConfigUseCase {
  constructor(
    @InjectRepository(ContactConfig)
    private readonly contactConfigRepository: Repository<ContactConfig>,
  ) {}

  async execute(): Promise<ContactConfig | null> {
    return this.contactConfigRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });
  }
}
