import type { ContactRequest } from '../../entities/contact-request.entity';

export class ContactRequestResponseDto {
  id: string;
  userId: string;
  listingId: string;
  message: string | null;
  createdAt: Date;

  constructor(contactRequest: ContactRequest) {
    this.id = contactRequest.id;
    this.userId = contactRequest.userId;
    this.listingId = contactRequest.listingId;
    this.message = contactRequest.message ?? null;
    this.createdAt = contactRequest.createdAt;
  }
}
