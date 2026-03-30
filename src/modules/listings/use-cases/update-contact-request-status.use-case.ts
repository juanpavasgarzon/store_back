import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from '../entities/contact-request.entity';
import { CONTACT_REQUEST_STATUS } from '../constants/contact-request-status.constants';
import type { ContactRequestStatus } from '../constants/contact-request-status.constants';

@Injectable()
export class UpdateContactRequestStatusUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
  ) {}

  async execute(id: string, status: ContactRequestStatus): Promise<ContactRequest> {
    const request = await this.contactRequestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Contact request not found');
    }
    request.status = status;
    if (status === CONTACT_REQUEST_STATUS.RESPONDED) {
      request.respondedAt = new Date();
    }
    return this.contactRequestRepository.save(request);
  }
}
