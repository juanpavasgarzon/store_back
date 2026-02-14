import { Injectable } from '@nestjs/common';
import type { IUser } from '../../../shared';
import type { IUserResponse } from '../dto/response/auth-response.interface';

@Injectable()
export class GetProfileUseCase {
  execute(user: IUser): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
