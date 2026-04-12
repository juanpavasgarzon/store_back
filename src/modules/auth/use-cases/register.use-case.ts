import { Injectable, ConflictException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../users/services/user.service';
import { CreateRefreshTokenUseCase } from './create-refresh-token.use-case';
import { ROLES } from '../../../shared/security';
import type { IAuthResponse } from '../dto/response/auth-response.interface';
import { RegisterRequestDto } from '../dto/request/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<IAuthResponse> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.authService.hashPassword(dto.password);
    const user = await this.userService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: ROLES.USER,
    });

    const iUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const payload = this.authService.buildPayload(iUser);
    const accessToken = await this.authService.signToken(payload);
    const refreshToken = await this.createRefreshTokenUseCase.execute(user.id);

    return {
      accessToken,
      refreshToken,
      user: iUser,
    };
  }
}
