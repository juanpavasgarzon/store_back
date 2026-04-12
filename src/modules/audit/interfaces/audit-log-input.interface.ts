import type { AuditAction } from '../constants/audit-action.constants';

export interface AuditLogInput {
  actorId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}
