import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from '../entities/contact-request.entity';
import { Listing } from '../entities/listing.entity';
import { CONTACT_REQUEST_STATUS } from '../constants/contact-request-status.constants';
import type { ContactRequestStatus } from '../constants/contact-request-status.constants';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';

@Injectable()
export class UpdateContactRequestStatusUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(id: string, status: ContactRequestStatus, user: IUser): Promise<ContactRequest> {
    const request = await this.contactRequestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException('Contact request not found');
    }

    if (!hasPermission(user, PERMISSIONS.CONTACT_REQUESTS_MANAGE_ANY)) {
      const listing = await this.listingRepository.findOne({ where: { id: request.listingId } });
      if (!listing || listing.userId !== user.id) {
        throw new ForbiddenException('You do not have permission to update this contact request');
      }
    }

    request.status = status;
    if (status === CONTACT_REQUEST_STATUS.RESPONDED) {
      request.respondedAt = new Date();
    }
    return this.contactRequestRepository.save(request);
  }
}
