export const LISTING_DOMAIN_EVENTS = {
  CONTACT_REQUEST_CREATED: 'listing.contact_request.created',
  REPORT_CREATED: 'listing.report.created',
  LISTING_SUSPENDED: 'listing.suspended',
} as const;

export type ListingDomainEvent = (typeof LISTING_DOMAIN_EVENTS)[keyof typeof LISTING_DOMAIN_EVENTS];

export interface ContactRequestCreatedEvent {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
  listingOwnerEmail: string;
  fromUserId: string;
  fromUserName: string;
  message: string | null;
}

export interface ListingSuspendedEvent {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
}
