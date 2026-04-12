import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async execute(rawToken: string): Promise<void> {
    const now = new Date();
    const tokenPrefix = rawToken.slice(0, 16);
    const candidates = await this.refreshTokenRepository.find({
      where: { tokenPrefix, revokedAt: IsNull(), expiresAt: MoreThan(now) },
    });

    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(rawToken, candidate.tokenHash);
      if (isMatch) {
        candidate.revokedAt = now;
        await this.refreshTokenRepository.save(candidate).catch((error: unknown) => {
          this.logger.error('Failed to revoke refresh token', error);
        });
        return;
      }
    }
  }
}
