export const AUDIT_ACTION = {
  LISTING_DELETED: 'listing:deleted',
  LISTING_BOOSTED: 'listing:boosted',
  USER_ROLE_CHANGED: 'user:role:changed',
  USER_DEACTIVATED: 'user:deactivated',
  USER_ACTIVATED: 'user:activated',
  USER_DELETED: 'user:deleted',
  USER_SELF_DELETED: 'user:self:deleted',
  CONTACT_CONFIG_UPDATED: 'contact_config:updated',
  LEGAL_UPSERTED: 'legal:upserted',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];
