import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { MailerService } from '../../mailer/mailer.service';
import { NOTIFICATION_EVENTS } from '../constants/notification-event.constants';
import {
  LISTING_DOMAIN_EVENTS,
  type ContactRequestCreatedEvent,
  type ListingSuspendedEvent,
} from '../../listings/events';

@Injectable()
export class ListingNotificationListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly mailerService: MailerService,
  ) {}

  @OnEvent(LISTING_DOMAIN_EVENTS.CONTACT_REQUEST_CREATED)
  async handleContactRequestCreated(event: ContactRequestCreatedEvent): Promise<void> {
    this.notificationsService.emitToUser(
      event.listingOwnerId,
      NOTIFICATION_EVENTS.CONTACT_REQUEST_RECEIVED,
      {
        listingId: event.listingId,
        listingTitle: event.listingTitle,
        fromUserId: event.fromUserId,
        fromUserName: event.fromUserName,
      },
    );

    await this.mailerService.sendMail({
      to: event.listingOwnerEmail,
      subject: `Nuevo mensaje sobre "${event.listingTitle}"`,
      html: `
        <p>Hola,</p>
        <p><strong>${event.fromUserName}</strong> está interesado en tu anuncio <strong>"${event.listingTitle}"</strong>.</p>
        ${event.message ? `<p>Mensaje: ${event.message}</p>` : ''}
        <p>Inicia sesión para ver los detalles.</p>
      `,
    });
  }

  @OnEvent(LISTING_DOMAIN_EVENTS.LISTING_SUSPENDED)
  handleListingSuspended(event: ListingSuspendedEvent): void {
    this.notificationsService.emitToUser(
      event.listingOwnerId,
      NOTIFICATION_EVENTS.LISTING_SUSPENDED,
      {
        listingId: event.listingId,
        listingTitle: event.listingTitle,
      },
    );
  }
}
