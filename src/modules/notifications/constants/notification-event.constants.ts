export const NOTIFICATION_EVENTS = {
  CONTACT_REQUEST_RECEIVED: 'contact_request.received',
  COMMENT_RECEIVED: 'comment.received',
  APPOINTMENT_UPDATED: 'appointment.updated',
  LISTING_SUSPENDED: 'listing.suspended',
} as const;

export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
