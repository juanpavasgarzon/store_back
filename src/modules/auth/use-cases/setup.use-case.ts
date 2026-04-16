import { ConflictException, Injectable } from '@nestjs/common';
import { ROLE_PERMISSIONS, ROLES } from '../../../shared/security';
import { UserService } from '../../users/services/user.service';
import { RegisterRequestDto } from '../dto/request/register.dto';
import type { IAuthResponse } from '../dto/response/auth-response.interface';
import { AuthService } from '../services/auth.service';
import { CreateRefreshTokenUseCase } from './create-refresh-token.use-case';

@Injectable()
export class SetupUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
  ) {}

  async execute(dto: RegisterRequestDto): Promise<IAuthResponse> {
    const ownerExists = await this.userService.ownerExists();
    if (ownerExists) {
      throw new ConflictException('Platform owner already exists');
    }

    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.authService.hashPassword(dto.password);
    const user = await this.userService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: ROLES.OWNER,
    });

    const iUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] ?? [],
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
