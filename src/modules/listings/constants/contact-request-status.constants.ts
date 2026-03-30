export const CONTACT_REQUEST_STATUS = {
  PENDING: 'pending',
  RESPONDED: 'responded',
  CLOSED: 'closed',
} as const;

export type ContactRequestStatus =
  (typeof CONTACT_REQUEST_STATUS)[keyof typeof CONTACT_REQUEST_STATUS];
