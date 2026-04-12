export const AUDIT_ACTION = {
  LISTING_DELETED: 'listing:deleted',
  USER_ROLE_CHANGED: 'user:role:changed',
  USER_DEACTIVATED: 'user:deactivated',
  USER_ACTIVATED: 'user:activated',
  USER_DELETED: 'user:deleted',
  CONTACT_CONFIG_UPDATED: 'contact_config:updated',
  LEGAL_UPSERTED: 'legal:upserted',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];
