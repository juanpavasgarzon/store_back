import type { ContactRequest } from '../../entities/contact-request.entity';
import { ListingResponseDto } from './listing-response.dto';

interface RequesterInfo {
  id: string;
  name: string;
  email: string;
}

export class ContactRequestResponseDto {
  id: string;
  userId: string;
  listingId: string;
  message: string | null;
  createdAt: Date;
  requester?: RequesterInfo;
  listing?: ListingResponseDto;

  constructor(contactRequest: ContactRequest) {
    this.id = contactRequest.id;
    this.userId = contactRequest.userId;
    this.listingId = contactRequest.listingId;
    this.message = contactRequest.message ?? null;
    this.createdAt = contactRequest.createdAt;
    if (contactRequest.user) {
      this.requester = {
        id: contactRequest.user.id,
        name: contactRequest.user.name,
        email: contactRequest.user.email,
      };
    }
    if (contactRequest.listing) {
      this.listing = new ListingResponseDto(contactRequest.listing);
    }
  }
}
