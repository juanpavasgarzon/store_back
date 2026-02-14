import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { User } from '../../users/entities/user.entity';
import type { JwtPayload } from '../interfaces';
import type { IUser } from '../../../shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signToken(payload: JwtPayload): Promise<string> {
    const expiresIn = this.config.get('jwt.expiresIn', '7d');
    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  async validateUser(user: User, password: string): Promise<IUser> {
    const isMatch = await bcrypt.compare(password, user.passwordHash ?? '');
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  buildPayload(user: IUser): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
