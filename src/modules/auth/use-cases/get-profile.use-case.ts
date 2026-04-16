import { Injectable } from '@nestjs/common';
import { ROLE_PERMISSIONS, type IUser } from '../../../shared';
import type { IUserResponse } from '../dto/response/auth-response.interface';

@Injectable()
export class GetProfileUseCase {
  execute(user: IUser): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] ?? [],
    };
  }
}
