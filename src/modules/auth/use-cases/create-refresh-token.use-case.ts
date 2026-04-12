import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from '../entities/refresh-token.entity';

const REFRESH_TOKEN_BYTES = 48;
const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const BCRYPT_ROUNDS = 10;

@Injectable()
export class CreateRefreshTokenUseCase {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async execute(userId: string): Promise<string> {
    const rawToken = randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const tokenPrefix = rawToken.slice(0, 16);
    const tokenHash = await bcrypt.hash(rawToken, BCRYPT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    const entity = this.refreshTokenRepository.create({
      userId,
      tokenPrefix,
      tokenHash,
      expiresAt,
      revokedAt: null,
    });
    await this.refreshTokenRepository.save(entity);

    return rawToken;
  }
}
