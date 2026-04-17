import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactRequest } from '../entities/contact-request.entity';
import { Listing } from '../entities/listing.entity';
import { User } from '../../users/entities/user.entity';
import { LISTING_DOMAIN_EVENTS, type ContactRequestCreatedEvent } from '../events';
import type { IUser } from '../../../shared';
import type { CreateContactRequestDto } from '../dto/request/create-contact-request.dto';

@Injectable()
export class CreateContactRequestUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
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

    const owner = await this.userRepository.findOne({ where: { id: listing.userId } });

    const contactRequest = this.contactRequestRepository.create({
      userId: user.id,
      listingId,
      message: dto.message ?? null,
    });
    const saved = await this.contactRequestRepository.save(contactRequest);

    const event: ContactRequestCreatedEvent = {
      listingId: listing.id,
      listingTitle: listing.title,
      listingOwnerId: listing.userId,
      listingOwnerEmail: owner?.email ?? '',
      fromUserId: user.id,
      fromUserName: user.name,
      message: dto.message ?? null,
    };
    this.eventEmitter.emit(LISTING_DOMAIN_EVENTS.CONTACT_REQUEST_CREATED, event);

    return saved;
  }
}
