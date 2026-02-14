import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from '../entities/contact-request.entity';
import type { IUser } from '../../../shared';

@Injectable()
export class ListMyContactRequestsUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
  ) {}

  async execute(user: IUser): Promise<ContactRequest[]> {
    return this.contactRequestRepository.find({
      where: { userId: user.id },
      relations: ['listing'],
      order: { createdAt: 'DESC' },
    });
  }
}
