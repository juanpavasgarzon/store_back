import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AuthService } from '../services/auth.service';
import { CreateRefreshTokenUseCase } from './create-refresh-token.use-case';
import type { IAuthResponse } from '../dto/response/auth-response.interface';
import { ROLE_PERMISSIONS } from 'src/shared';

@Injectable()
export class RefreshAccessTokenUseCase {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly authService: AuthService,
    private readonly createRefreshTokenUseCase: CreateRefreshTokenUseCase,
  ) {}

  async execute(rawToken: string): Promise<IAuthResponse> {
    const now = new Date();
    const tokenPrefix = rawToken.slice(0, 16);
    const candidates = await this.refreshTokenRepository.find({
      where: { tokenPrefix, revokedAt: IsNull(), expiresAt: MoreThan(now) },
      relations: ['user'],
    });

    let matched: RefreshToken | null = null;
    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(rawToken, candidate.tokenHash);
      if (isMatch) {
        matched = candidate;
        break;
      }
    }

    if (!matched || !matched.user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    matched.revokedAt = now;
    await this.refreshTokenRepository.save(matched);

    const user = matched.user;
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
