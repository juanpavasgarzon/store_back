import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { GetProfileUseCase } from '../use-cases/get-profile.use-case';
import { MeProfileResponseDto } from '../dto/response/me-profile-response.dto';
import { FavoriteService } from '../../listings/services/favorite.service';
import { ContactRequestService } from '../../listings/services/contact-request.service';
import { AppointmentService } from '../../listings/services/appointment.service';
import { FavoriteResponseDto } from '../../listings/dto/response/favorite-response.dto';
import { ContactRequestResponseDto } from '../../listings/dto/response/contact-request-response.dto';
import { AppointmentResponseDto } from '../../listings/dto/response/appointment-response.dto';

@Controller('users/me')
export class MeController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly favoriteService: FavoriteService,
    private readonly contactRequestService: ContactRequestService,
    private readonly appointmentService: AppointmentService,
  ) {}

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser() user: IUser): MeProfileResponseDto {
    const result = this.getProfileUseCase.execute(user);
    return new MeProfileResponseDto(result);
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  async listMyFavorites(@CurrentUser() user: IUser): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteService.listMyFavorites(user);
    return favorites.map((f) => new FavoriteResponseDto(f));
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('contact-requests')
  @HttpCode(HttpStatus.OK)
  async listMyContactRequests(@CurrentUser() user: IUser): Promise<ContactRequestResponseDto[]> {
    const list = await this.contactRequestService.listMyContactRequests(user);
    return list.map((r) => new ContactRequestResponseDto(r));
  }

  @RequirePermissions(PERMISSIONS.USERS_ME_READ)
  @Get('appointments')
  @HttpCode(HttpStatus.OK)
  async listMyAppointments(@CurrentUser() user: IUser): Promise<AppointmentResponseDto[]> {
    const list = await this.appointmentService.listMyAppointments(user);
    return list.map((a) => new AppointmentResponseDto(a));
  }
}
