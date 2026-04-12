import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_ACTION } from '../../audit/constants/audit-action.constants';
import type { Role } from '../../../shared/security/interfaces/role.interface';

@Injectable()
export class SetUserRoleUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async execute(id: string, role: Role, actorId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const previousRole = user.role;
    user.role = role;
    const saved = await this.userRepository.save(user);
    await this.auditService.log({
      actorId,
      action: AUDIT_ACTION.USER_ROLE_CHANGED,
      entity: 'user',
      entityId: id,
      before: { role: previousRole },
      after: { role },
    });
    return saved;
  }
}
