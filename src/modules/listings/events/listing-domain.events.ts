export const LISTING_DOMAIN_EVENTS = {
  COMMENT_CREATED: 'listing.comment.created',
  CONTACT_REQUEST_CREATED: 'listing.contact_request.created',
  REPORT_CREATED: 'listing.report.created',
  LISTING_SUSPENDED: 'listing.suspended',
  APPOINTMENT_STATUS_CHANGED: 'listing.appointment.status_changed',
} as const;

export type ListingDomainEvent = (typeof LISTING_DOMAIN_EVENTS)[keyof typeof LISTING_DOMAIN_EVENTS];

export interface CommentCreatedEvent {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
  fromUserId: string;
  fromUserName: string;
}

export interface ContactRequestCreatedEvent {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
  fromUserId: string;
  fromUserName: string;
}

export interface ListingSuspendedEvent {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
}

export interface AppointmentStatusChangedEvent {
  appointmentId: string;
  listingId: string;
  listingTitle: string | null;
  userId: string;
  newStatus: string;
}
