export const NOTIFICATION_EVENTS = {
  CONTACT_REQUEST_RECEIVED: 'contact_request.received',
  LISTING_SUSPENDED: 'listing.suspended',
} as const;

export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
