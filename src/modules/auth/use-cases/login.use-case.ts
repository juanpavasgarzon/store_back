import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateRefreshTokenUseCase } from './create-refresh-token.use-case';
import type { IAuthResponse, IUserResponse } from '../dto/response/auth-response.interface';
import type { IUser } from '../../../shared';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
  ) {}

  async execute(user: IUser): Promise<IAuthResponse> {
    const payload = this.authService.buildPayload(user);
    const accessToken = await this.authService.signToken(payload);
    const refreshToken = await this.createRefreshTokenUseCase.execute(user.id);
    return {
      accessToken,
      refreshToken,
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
