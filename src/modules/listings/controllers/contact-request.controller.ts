import { Controller, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { CreateContactRequestUseCase } from '../use-cases/create-contact-request.use-case';
import { CreateContactRequestDto } from '../dto/request/create-contact-request.dto';
import { ContactRequestResponseDto } from '../dto/response/contact-request-response.dto';

@Controller('listings/:listingId/contact-requests')
export class ContactRequestController {
  constructor(private readonly createContactRequestUseCase: CreateContactRequestUseCase) {}

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
}
