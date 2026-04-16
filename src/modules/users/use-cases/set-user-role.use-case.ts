import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_ACTION } from '../../audit/constants/audit-action.constants';
import { ROLES } from '../../../shared/security/constants/roles.constants';
import type { Role } from '../../../shared/security/interfaces/role.interface';
import type { IUser } from '../../../shared/security/interfaces/user.interface';

const ROLES_ASSIGNABLE_BY_ADMIN: Role[] = [ROLES.USER, ROLES.MODERATOR];

@Injectable()
export class SetUserRoleUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async execute(id: string, role: Role, actor: IUser): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (actor.role === ROLES.ADMIN && !ROLES_ASSIGNABLE_BY_ADMIN.includes(role)) {
      throw new ForbiddenException('Admins can only assign the user or moderator role');
    }

    const previousRole = user.role;
    user.role = role;
    const saved = await this.userRepository.save(user);
    await this.auditService.log({
      actorId: actor.id,
      action: AUDIT_ACTION.USER_ROLE_CHANGED,
      entity: 'user',
      entityId: id,
      before: { role: previousRole },
      after: { role },
    });
    return saved;
  }
}
