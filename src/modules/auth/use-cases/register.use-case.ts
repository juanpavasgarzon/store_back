import { Injectable, ConflictException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../users/services/user.service';
import { ROLES } from '../../../shared/security';
import type { IAuthResponse } from '../dto/response/auth-response.interface';
import { RegisterRequestDto } from '../dto/request/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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

    const payload = this.authService.buildPayload(user);
    const accessToken = await this.authService.signToken(payload);
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken,
      user: userResponse,
    };
  }
}
