import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import type { IAuthResponse, IUserResponse } from '../dto/response/auth-response.interface';
import type { IUser } from '../../../shared';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(user: IUser): Promise<IAuthResponse> {
    const payload = this.authService.buildPayload(user);
    const accessToken = await this.authService.signToken(payload);
    return {
      accessToken,
      user: this.toUserResponse(user),
    };
  }

  private toUserResponse(user: IUser): IUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
