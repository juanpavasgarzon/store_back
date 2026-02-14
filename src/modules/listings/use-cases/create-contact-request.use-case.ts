import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from '../entities/contact-request.entity';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import type { CreateContactRequestDto } from '../dto/request/create-contact-request.dto';

@Injectable()
export class CreateContactRequestUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(
    listingId: string,
    user: IUser,
    dto: CreateContactRequestDto,
  ): Promise<ContactRequest> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const contactRequest = this.contactRequestRepository.create({
      userId: user.id,
      listingId,
      message: dto.message ?? null,
    });
    return this.contactRequestRepository.save(contactRequest);
  }
}
