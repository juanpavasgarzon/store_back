import { Injectable } from '@nestjs/common';
import type { IUser } from '../../../shared';
import type { MeProfileShape } from '../interfaces/me-profile.interface';

@Injectable()
export class GetProfileUseCase {
  execute(user: IUser): MeProfileShape {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
