import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RegisterUseCase } from '../use-cases/register.use-case';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser, Public } from '../../../shared';
import type { IUser } from '../../../shared';
import { LoginRequestDto } from '../dto/request/login.dto';
import { AuthResponseDto } from '../dto/response/auth-response.dto';
import { RegisterRequestDto } from '../dto/request/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() _dto: LoginRequestDto, @CurrentUser() user: IUser): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(user);
    return new AuthResponseDto(result);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequestDto): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.execute(request);
    return new AuthResponseDto(result);
  }
}
