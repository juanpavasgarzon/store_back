import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ROLES } from '../../../shared/security/constants/roles.constants';

@Injectable()
export class CheckOwnerExistsUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(): Promise<boolean> {
    const count = await this.userRepository.count({ where: { role: ROLES.OWNER } });
    return count > 0;
  }
}
