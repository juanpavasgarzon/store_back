import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactRequest } from '../entities/contact-request.entity';
import { Listing } from '../entities/listing.entity';
import { FindContactConfigUseCase } from '../../contact/use-cases/find-contact-config.use-case';
import { MailerService } from '../../mailer/mailer.service';
import { LISTING_DOMAIN_EVENTS, type ContactRequestCreatedEvent } from '../events';
import type { IUser } from '../../../shared';
import type { CreateContactRequestDto } from '../dto/request/create-contact-request.dto';

@Injectable()
export class CreateContactRequestUseCase {
  private readonly logger = new Logger(CreateContactRequestUseCase.name);

  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly findContactConfigUseCase: FindContactConfigUseCase,
    private readonly mailerService: MailerService,
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
      fromUserId: user.id,
      fromUserName: user.name,
    };
    this.eventEmitter.emit(LISTING_DOMAIN_EVENTS.CONTACT_REQUEST_CREATED, event);

    this.sendNotificationEmail(user, listing, dto.message ?? null).catch((error: unknown) => {
      this.logger.error('Failed to send contact request notification email', error);
    });

    return saved;
  }

  private async sendNotificationEmail(
    user: IUser,
    listing: Listing,
    message: string | null,
  ): Promise<void> {
    const config = await this.findContactConfigUseCase.execute();
    if (!config) {
      return;
    }

    const subject = this.interpolate(
      config.subjectTemplate ?? 'New contact request for {{listing}}',
      user,
      listing,
      message,
    );

    const body = this.interpolate(
      config.messageTemplate ??
        '<p>New contact request from <strong>{{name}}</strong> ({{email}}) for listing <strong>{{listing}}</strong>.</p><p>Message: {{message}}</p>',
      user,
      listing,
      message,
    );

    await this.mailerService.sendMail({
      to: config.recipientEmail,
      subject,
      html: body,
    });
  }

  private interpolate(
    template: string,
    user: IUser,
    listing: Listing,
    message: string | null,
  ): string {
    return template
      .replace(/\{\{name\}\}/g, user.name)
      .replace(/\{\{email\}\}/g, user.email)
      .replace(/\{\{listing\}\}/g, listing.title)
      .replace(/\{\{message\}\}/g, message ?? '(no message)');
  }
}
