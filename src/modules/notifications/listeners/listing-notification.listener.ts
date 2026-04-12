import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { NOTIFICATION_EVENTS } from '../constants/notification-event.constants';
import {
  LISTING_DOMAIN_EVENTS,
  type CommentCreatedEvent,
  type ContactRequestCreatedEvent,
  type ListingSuspendedEvent,
  type AppointmentStatusChangedEvent,
} from '../../listings/events';

@Injectable()
export class ListingNotificationListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent(LISTING_DOMAIN_EVENTS.COMMENT_CREATED)
  handleCommentCreated(event: CommentCreatedEvent): void {
    this.notificationsService.emitToUser(
      event.listingOwnerId,
      NOTIFICATION_EVENTS.COMMENT_RECEIVED,
      {
        listingId: event.listingId,
        listingTitle: event.listingTitle,
        fromUserId: event.fromUserId,
        fromUserName: event.fromUserName,
      },
    );
  }

  @OnEvent(LISTING_DOMAIN_EVENTS.CONTACT_REQUEST_CREATED)
  handleContactRequestCreated(event: ContactRequestCreatedEvent): void {
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

  @OnEvent(LISTING_DOMAIN_EVENTS.APPOINTMENT_STATUS_CHANGED)
  handleAppointmentStatusChanged(event: AppointmentStatusChangedEvent): void {
    this.notificationsService.emitToUser(event.userId, NOTIFICATION_EVENTS.APPOINTMENT_UPDATED, {
      appointmentId: event.appointmentId,
      listingId: event.listingId,
      listingTitle: event.listingTitle,
      newStatus: event.newStatus,
    });
  }
}
