import type { ContactRequest } from '../../entities/contact-request.entity';
import type { ContactRequestStatus } from '../../constants/contact-request-status.constants';
import { ListingResponseDto } from './listing-response.dto';

export class ContactRequestResponseDto {
  id: string;
  userId: string;
  listingId: string;
  message: string | null;
  status: ContactRequestStatus;
  respondedAt: Date | null;
  createdAt: Date;
  listing?: ListingResponseDto;

  constructor(contactRequest: ContactRequest) {
    this.id = contactRequest.id;
    this.userId = contactRequest.userId;
    this.listingId = contactRequest.listingId;
    this.message = contactRequest.message ?? null;
    this.status = contactRequest.status;
    this.respondedAt = contactRequest.respondedAt ?? null;
    this.createdAt = contactRequest.createdAt;
    if (contactRequest.listing) {
      this.listing = new ListingResponseDto(contactRequest.listing);
    }
  }
}
