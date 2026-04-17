import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUser } from '../../../shared';
import { ROLE_PERMISSIONS } from '../../../shared/security/constants/role-permissions';
import { User } from '../entities/user.entity';
import type { MeProfileShape } from '../interfaces/me-profile.interface';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(user: IUser): Promise<MeProfileShape> {
    const found = await this.userRepository.findOne({ where: { id: user.id } });
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      permissions: ROLE_PERMISSIONS[found.role] ?? [],
      phone: found.phone,
      city: found.city,
    };
  }
}
