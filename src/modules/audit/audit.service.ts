import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import type { AuditLogInput } from './interfaces/audit-log-input.interface';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(input: AuditLogInput): Promise<void> {
    try {
      const entry = this.auditLogRepository.create({
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        before: input.before ?? null,
        after: input.after ?? null,
      });
      await this.auditLogRepository.save(entry);
    } catch (error: unknown) {
      this.logger.error('Failed to persist audit log', error);
    }
  }
}
