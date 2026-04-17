import { Entity, Column, CreateDateColumn } from 'typeorm';
import type { AuditAction } from '../constants/audit-action.constants';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  actorId!: string | null;

  @Column({ type: 'varchar', length: 80 })
  action!: AuditAction;

  @Column({ type: 'varchar', length: 80 })
  entity!: string;

  @Column({ type: 'uuid', nullable: true })
  entityId!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before!: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  after!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;
}
