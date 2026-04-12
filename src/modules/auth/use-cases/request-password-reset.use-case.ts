import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { MailerService } from '../../mailer/mailer.service';

const BCRYPT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_HOURS = 1;

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return;
    }

    await this.passwordResetTokenRepository.update(
      { userId: user.id, used: false },
      { used: true },
    );

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, BCRYPT_ROUNDS);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);

    const entity = this.passwordResetTokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false,
    });
    await this.passwordResetTokenRepository.save(entity);

    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password. The link expires in ${RESET_TOKEN_EXPIRY_HOURS} hour.</p>
        <p><a href="${resetLink}">Reset my password</a></p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      `,
    });
  }
}
