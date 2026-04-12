import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { RefreshAccessTokenUseCase } from '../use-cases/refresh-access-token.use-case';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { RequestPasswordResetUseCase } from '../use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from '../use-cases/reset-password.use-case';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser, Public } from '../../../shared';
import type { IUser } from '../../../shared';
import { LoginRequestDto } from '../dto/request/login.dto';
import { AuthResponseDto } from '../dto/response/auth-response.dto';
import { RegisterRequestDto } from '../dto/request/register.dto';
import { RefreshTokenRequestDto } from '../dto/request/refresh-token.dto';
import { RequestPasswordResetDto } from '../dto/request/request-password-reset.dto';
import { ResetPasswordDto } from '../dto/request/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() _dto: LoginRequestDto, @CurrentUser() user: IUser): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(user);
    return new AuthResponseDto(result);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequestDto): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.execute(request);
    return new AuthResponseDto(result);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    const result = await this.refreshAccessTokenUseCase.execute(dto.refreshToken);
    return new AuthResponseDto(result);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() dto: RefreshTokenRequestDto): Promise<void> {
    await this.logoutUseCase.execute(dto.refreshToken);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('password-reset/request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto): Promise<void> {
    await this.requestPasswordResetUseCase.execute(dto.email);
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetPasswordUseCase.execute(dto.email, dto.token, dto.newPassword);
  }
}
