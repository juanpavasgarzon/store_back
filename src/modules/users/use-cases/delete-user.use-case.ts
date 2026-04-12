import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_ACTION } from '../../audit/constants/audit-action.constants';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditService: AuditService,
  ) {}

  async execute(id: string, actorId: string): Promise<void> {
    if (id === actorId) {
      throw new BadRequestException('You cannot delete your own account');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.softDelete(id);
    await this.auditService.log({
      actorId,
      action: AUDIT_ACTION.USER_DELETED,
      entity: 'user',
      entityId: id,
      before: { email: user.email, role: user.role },
    });
  }
}
