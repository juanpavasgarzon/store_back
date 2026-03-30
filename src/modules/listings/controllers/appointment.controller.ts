import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateAppointmentUseCase } from '../use-cases/create-appointment.use-case';
import { UpdateAppointmentUseCase } from '../use-cases/update-appointment.use-case';
import { DeleteAppointmentUseCase } from '../use-cases/delete-appointment.use-case';
import { ListListingAppointmentsUseCase } from '../use-cases/list-listing-appointments.use-case';
import { CreateAppointmentRequestDto } from '../dto/request/create-appointment.dto';
import { UpdateAppointmentRequestDto } from '../dto/request/update-appointment.dto';
import { AppointmentResponseDto } from '../dto/response/appointment-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('listings/:listingId/calendar')
export class AppointmentController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase,
    private readonly listListingAppointmentsUseCase: ListListingAppointmentsUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.CALENDAR_READ)
  @Get()
  @HttpCode(HttpStatus.OK)
  async listByListing(
    @Param('listingId') listingId: string,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<AppointmentResponseDto>> {
    const result = await this.listListingAppointmentsUseCase.execute(listingId, query);
    return new PaginationResponse(
      result.data.map((a) => new AppointmentResponseDto(a)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.CALENDAR_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() request: CreateAppointmentRequestDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.createAppointmentUseCase.execute(listingId, user, request);
    return new AppointmentResponseDto(appointment);
  }

  @RequirePermissions(PERMISSIONS.CALENDAR_UPDATE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('listingId') _listingId: string,
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @Body() request: UpdateAppointmentRequestDto,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.updateAppointmentUseCase.execute(id, user, request);
    return new AppointmentResponseDto(appointment);
  }

  @RequirePermissions(PERMISSIONS.CALENDAR_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('listingId') _listingId: string,
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<void> {
    await this.deleteAppointmentUseCase.execute(id, user);
  }
}
