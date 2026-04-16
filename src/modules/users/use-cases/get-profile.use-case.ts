import { Injectable } from '@nestjs/common';
import type { IUser } from '../../../shared';
import type { MeProfileShape } from '../interfaces/me-profile.interface';
import { ROLE_PERMISSIONS } from '../../../shared/security/constants/role-permissions';

@Injectable()
export class GetProfileUseCase {
  execute(user: IUser): MeProfileShape {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] ?? [],
    };
  }
}
