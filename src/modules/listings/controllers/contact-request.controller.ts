import { Controller, Post, Patch, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateContactRequestUseCase } from '../use-cases/create-contact-request.use-case';
import { UpdateContactRequestStatusUseCase } from '../use-cases/update-contact-request-status.use-case';
import { CreateContactRequestDto } from '../dto/request/create-contact-request.dto';
import { UpdateContactRequestStatusDto } from '../dto/request/update-contact-request-status.dto';
import { ContactRequestResponseDto } from '../dto/response/contact-request-response.dto';

@Controller('listings/:listingId/contact-requests')
export class ContactRequestController {
  constructor(
    private readonly createContactRequestUseCase: CreateContactRequestUseCase,
    private readonly updateContactRequestStatusUseCase: UpdateContactRequestStatusUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.CONTACT_REQUESTS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() request: CreateContactRequestDto,
  ): Promise<ContactRequestResponseDto> {
    const contactRequest = await this.createContactRequestUseCase.execute(listingId, user, request);
    return new ContactRequestResponseDto(contactRequest);
  }

  @RequirePermissions(PERMISSIONS.CONTACT_REQUESTS_UPDATE)
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactRequestStatusDto,
  ): Promise<ContactRequestResponseDto> {
    const updated = await this.updateContactRequestStatusUseCase.execute(id, dto.status);
    return new ContactRequestResponseDto(updated);
  }
}
